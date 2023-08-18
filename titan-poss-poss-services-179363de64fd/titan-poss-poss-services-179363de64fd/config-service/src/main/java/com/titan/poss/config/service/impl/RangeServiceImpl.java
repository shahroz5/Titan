/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.config.dao.RangeMasterDaoExt;
import com.titan.poss.config.dao.SyncStaging;
import com.titan.poss.config.dto.RangeMasterSyncDtoExt;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.request.AddRangeDto;
import com.titan.poss.config.dto.request.RangeRequestDto;
import com.titan.poss.config.dto.request.UpdateRange;
import com.titan.poss.config.dto.response.RangeResponseDto;
import com.titan.poss.config.repository.ConfigSyncStagingRepository;
import com.titan.poss.config.repository.RangeMasterRepositoryExt;
import com.titan.poss.config.service.ConfigSyncDataService;
import com.titan.poss.config.service.RangeService;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Service("rangeService")
public class RangeServiceImpl implements RangeService {

	@Autowired
	private RangeMasterRepositoryExt rangeMasterRepository;

	@Autowired
	private RangeServiceImpl rangeServiceImp;

	@Autowired
	private ConfigSyncDataService syncDataService;

	@Autowired
	private ConfigSyncStagingRepository configSyncStagingRepository;

	@Override
	public PagedRestResponse<List<RangeResponseDto>> listRange(String id, String rangeType, Boolean isPageable,
			Boolean isActive, Pageable pageable) {
		if (!isPageable) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		List<RangeResponseDto> rangeResponseList = new ArrayList<>();
		Example<RangeMasterDaoExt> rangeDaoExample = getRangeExampleObj(id, rangeType, isActive);
		Page<RangeMasterDaoExt> rangeDaoPage = rangeMasterRepository.findAll(rangeDaoExample, pageable);
		rangeDaoPage.forEach(record -> {
			RangeResponseDto rangeResp = (RangeResponseDto) MapperUtil.getDtoMapping(record, RangeResponseDto.class);
			rangeResponseList.add(rangeResp);
		});
		return new PagedRestResponse<>(rangeResponseList, rangeDaoPage);
	}

	private Example<RangeMasterDaoExt> getRangeExampleObj(String id, String rangeType, Boolean isActive) {
		RangeMasterDaoExt rangeDao = new RangeMasterDaoExt();
		rangeDao.setId(id);
		rangeDao.setRangeType(rangeType);
		rangeDao.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(rangeDao, matcher);
	}

	@Override
	public ListResponse<RangeResponseDto> updateRange(String rangeType, RangeRequestDto rangeRequestDto) {
		List<RangeResponseDto> rangeResponseList = new ArrayList<>();
		SyncStagingDto syncStagingDto = rangeServiceImp.saveRangAndStaging(rangeResponseList, rangeType,
				rangeRequestDto);
		if (syncStagingDto != null)
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		return new ListResponse<>(rangeResponseList);
	}

	/**
	 * @param rangeResponseList
	 * @param rangeType
	 * @param rangeRequestDto
	 */
	@Transactional
	public SyncStagingDto saveRangAndStaging(List<RangeResponseDto> rangeResponseList, String rangeType,
			RangeRequestDto rangeRequestDto) {
		List<RangeMasterDaoExt> rangeDaoList = new ArrayList<>();
		updateRangeDetails(rangeType, rangeRequestDto.getUpdateRanges(), rangeDaoList);
		addRangeDetails(rangeType, rangeRequestDto.getAddRanges(), rangeDaoList);
		List<SyncData> rangeSyncDatas = new ArrayList<>();
		if (!rangeDaoList.isEmpty()) {
			rangeDaoList = rangeMasterRepository.saveAll(rangeDaoList);
			RangeMasterSyncDtoExt rangeMasterSyncDto = new RangeMasterSyncDtoExt();
			rangeSyncDatas.add(DataSyncUtil.createSyncData(rangeMasterSyncDto.getSyncDtoList(rangeDaoList), 0));
		}

		rangeDaoList.forEach(record -> {
			RangeResponseDto rangeDto = (RangeResponseDto) MapperUtil.getDtoMapping(record, RangeResponseDto.class);
			rangeResponseList.add(rangeDto);
		});

		List<String> destinations = new ArrayList<>();
		SyncStagingDto stagingDto = null;
		if (!rangeSyncDatas.isEmpty()) {
			stagingDto = rangeServiceImp.saveRangeToSyncStaging(rangeSyncDatas, ConfigServiceOperationCodes.RANGE_ADD,
					destinations, DestinationType.ALL.toString());
		}
		return stagingDto;
	}

	private void addRangeDetails(String rangeType, Set<AddRangeDto> addRanges, List<RangeMasterDaoExt> rangeDaoList) {
		if (!CollectionUtils.isEmpty(addRanges)) {
			addRanges.forEach(record -> {
				// from range should be lesser than to range
				if (record.getFromRange().compareTo(record.getToRange()) > 0) {
					throw new ServiceException(ConfigConstants.FROM_RANGE_SHOULD_BE_LESSER_THAN_TO_RANGE,
							ConfigConstants.ERR_CONFIG_099,
							"From range : " + record.getFromRange() + " , To range : " + record.getToRange());
				}
				RangeMasterDaoExt rangeDao = new RangeMasterDaoExt();
				rangeDao = (RangeMasterDaoExt) MapperUtil.getDtoMapping(record, RangeMasterDaoExt.class);
				rangeDao.setRangeType(rangeType);
				rangeDaoList.add(rangeDao);
			});
		}
	}

	private void updateRangeDetails(String rangeType, Set<UpdateRange> updateRanges,
			List<RangeMasterDaoExt> rangeDaoList) {
		if (!CollectionUtils.isEmpty(updateRanges)) {
			updateRanges.forEach(record -> {
				RangeMasterDaoExt rangeDao = rangeMasterRepository.findByIdAndRangeType(record.getId(), rangeType);
				if (rangeDao == null) {
					throw new ServiceException(ConfigConstants.NO_RANGE_DETAILS_FOUND, ConfigConstants.ERR_CONFIG_011,
							"No range details found for the requested id and rangeType. id - " + record.getId()
									+ " , rangeType - " + rangeType);
				}
				rangeDao.setSrcSyncId(rangeDao.getSrcSyncId() + 1);
				MapperUtil.getObjectMapping(record, rangeDao);
				rangeDaoList.add(rangeDao);
			});
		}
	}

	/**
	 * @param rangeSyncDatas
	 * @param rangeAdd
	 * @param destinations
	 * @param string
	 * @return SyncStagingDto
	 */
	public SyncStagingDto saveRangeToSyncStaging(List<SyncData> rangeSyncDatas, String operation,
			List<String> destinations, String destinationType) {
		SyncStagingDto rangeSyncStagingDto = new SyncStagingDto();
		MessageRequest rangeMsgRequest = DataSyncUtil.createMessageRequest(rangeSyncDatas, operation, destinations,
				MessageType.GENERAL.toString(), destinationType);
		String rangeRequestBody = MapperUtil.getJsonString(rangeMsgRequest);
		SyncStaging rangeStaggingMsg = new SyncStaging();
		rangeStaggingMsg.setMessage(rangeRequestBody);
		rangeStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		rangeStaggingMsg = configSyncStagingRepository.save(rangeStaggingMsg);
		rangeSyncStagingDto.setMessageRequest(rangeMsgRequest);
		rangeSyncStagingDto.setId(rangeStaggingMsg.getId());
		return rangeSyncStagingDto;
	}

	@Override
	public RangeResponseDto getRange(String id, String rangeType) {
		RangeMasterDaoExt rangeDao = getRangeMasterDao(id);
		return (RangeResponseDto) MapperUtil.getDtoMapping(rangeDao, RangeResponseDto.class);
	}

	@Override
	public RangeMasterDaoExt getRangeMasterDao(String id) {
		return rangeMasterRepository.findById(id)
				.orElseThrow(() -> new ServiceException(ConfigConstants.NO_RANGE_DETAILS_FOUND,
						ConfigConstants.ERR_CONFIG_011, "No range details found for the requested rangeId : " + id));
	}

	@Override
	public RangeMasterDaoExt getActiveRangeId(String rangeId) {
		RangeMasterDaoExt rangeMaster = rangeMasterRepository.findByIdAndIsActiveTrue(rangeId);
		if (rangeMaster == null) {
			throw new ServiceException(ConfigConstants.NO_RANGE_DETAILS_FOUND, ConfigConstants.ERR_CONFIG_011,
					ConfigConstants.RANGE_ID + rangeId + " & isActive : false");
		}
		return rangeMaster;
	}

}
