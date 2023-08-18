/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.config.dao.ConfigLovDaoExt;
import com.titan.poss.config.dao.SyncStaging;
import com.titan.poss.config.dto.ConfigLovSyncDtoExt;
import com.titan.poss.config.dto.LovTypesDto;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.LovTypeEnum;
import com.titan.poss.config.dto.request.LovUpdateDto;
import com.titan.poss.config.dto.response.LovCreateDto;
import com.titan.poss.config.repository.ConfigLovRepositoryExt;
import com.titan.poss.config.repository.ConfigSyncStagingRepository;
import com.titan.poss.config.service.ConfigSyncDataService;
import com.titan.poss.config.service.LovService;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("LOV_SERVICE_IMPL")
public class LovServiceImpl implements LovService {

	@Autowired
	ConfigLovRepositoryExt lovRepository;

	@Autowired
	LovServiceImpl lovServiceImp;

	@Autowired
	private ConfigSyncDataService syncDataService;

	@Autowired
	private ConfigSyncStagingRepository configSyncStagingRepository;

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@Override
	public LovTypesDto getLovTypes() {
		List<String> lovTypes = new ArrayList<>();
		EnumSet.allOf(LovTypeEnum.class).forEach(lovTypeEnum -> lovTypes.add(lovTypeEnum.toString()));
		LovTypesDto lovTypesDto = new LovTypesDto();
		lovTypesDto.setLovTypes(lovTypes);
		return lovTypesDto;
	}

	@Override
	public LovDto getLov(String lovType, String lovCode) {
		List<ConfigLovDaoExt> configLovList = lovRepository.findByLovTypeAndCode(lovType, lovCode);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!configLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoList = new ArrayList<>();
			configLovList.forEach(configLov -> keyValueDtoList
					.add((KeyValueDto) MapperUtil.getObjectMapping(configLov, new KeyValueDto())));

			lovDto.setResults(keyValueDtoList.stream().sorted(Comparator.comparing(KeyValueDto::getCode))
					.collect(Collectors.toList()));
		} else {
			lovDto.setResults(new ArrayList<>());
		}
		return lovDto;
	}

	@Override
	public LovCreateDto createLov(LovCreateDto lovCreateDto) {
		ConfigLovDaoExt configLovCriteria = new ConfigLovDaoExt();
		configLovCriteria.setLovType(lovCreateDto.getLovType());
		configLovCriteria.setCode(lovCreateDto.getCode());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ConfigLovDaoExt> criteria = Example.of(configLovCriteria, matcher);
		Optional<ConfigLovDaoExt> configLovOptional = lovRepository.findOne(criteria);
		if (!configLovOptional.isEmpty()) {
			throw new ServiceException(ConfigConstants.LOV_TYPE_AND_CODE_IS_ALREADY_AVAILABLE,
					ConfigConstants.ERR_CONFIG_100,
					"LOV type : " + lovCreateDto.getLovType() + " ,lov code : " + lovCreateDto.getCode());
		}
		ConfigLovDaoExt configLovDao = (ConfigLovDaoExt) MapperUtil.getObjectMapping(lovCreateDto,
				new ConfigLovDaoExt());
		configLovDao.setLovType(lovCreateDto.getLovType());
		configLovDao.setIsActive(true);

		List<ConfigLovDaoExt> configLovList = new ArrayList<>();
		configLovList.add(configLovDao);
		SyncStagingDto syncStagingDto = lovServiceImp.saveConfigLovAndStaging(configLovList,
				ConfigServiceOperationCodes.CONFIG_LOV_ADD);

		syncDataService.publishConfigMessagesToQueue(syncStagingDto);

		return (LovCreateDto) MapperUtil.getDtoMapping(configLovDao, LovCreateDto.class);
	}

	/**
	 * @param configLovList
	 * @param configLovAdd
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveConfigLovAndStaging(List<ConfigLovDaoExt> configLovList, String operation) {
		configLovList = lovRepository.saveAll(configLovList);
		List<SyncData> locLovSyncData = new ArrayList<>();
		ConfigLovSyncDtoExt syncDto = new ConfigLovSyncDtoExt();
		locLovSyncData.add(DataSyncUtil.createSyncData(syncDto.getSyncDtoExtList(configLovList), 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto rangeSyncStagingDto = new SyncStagingDto();
		MessageRequest rangeMsgRequest = DataSyncUtil.createMessageRequest(locLovSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.name());
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
	public LovDto updateLov(String lovType, LovUpdateDto lovUpdateDto) {
		List<ConfigLovDaoExt> configLovList = lovRepository.findByLovType(lovType);
		List<KeyValueDto> keyValueDtoList = lovUpdateDto.getValues();
		int sizeDto = keyValueDtoList.size();
		int size = configLovList.size();

		for (int i = 0; i < sizeDto; i++) {
			Integer index = null;
			for (int j = 0; j < size; j++) {
				if (configLovList.get(j).getCode().equalsIgnoreCase(keyValueDtoList.get(i).getCode())) {
					index = j;
					break;
				}
			}
			if (index != null) {

				ConfigLovDaoExt configLovDao = configLovList.get(index);

				configLovDao.setValue(keyValueDtoList.get(i).getValue());
				configLovDao.setIsActive(keyValueDtoList.get(i).getIsActive());
				configLovDao.setSrcSyncId(configLovDao.getSrcSyncId() + 1);
				configLovList.set(index, configLovDao);

			} else {

				ConfigLovDaoExt configLovDao = new ConfigLovDaoExt();
				configLovDao.setLovType(lovType);
				configLovDao.setCode(keyValueDtoList.get(i).getCode());
				configLovDao.setValue(keyValueDtoList.get(i).getValue());
				configLovDao.setIsActive(keyValueDtoList.get(i).getIsActive());
				configLovDao.setSrcSyncId(0);
				configLovDao.setDestSyncId(0);
				configLovList.add(configLovDao);

			}
		}

		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!configLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoResList = new ArrayList<>();
			configLovList.forEach(paymentLov -> keyValueDtoResList
					.add((KeyValueDto) MapperUtil.getObjectMapping(paymentLov, new KeyValueDto())));
			lovDto.setResults(keyValueDtoResList);
		} else {
			lovDto.setResults(new ArrayList<>());
		}

		SyncStagingDto syncStagingDto = lovServiceImp.saveConfigLovAndStaging(configLovList,
				ConfigServiceOperationCodes.CONFIG_LOV_UPDATE);

		syncDataService.publishConfigMessagesToQueue(syncStagingDto);

		return lovDto;
	}
}
