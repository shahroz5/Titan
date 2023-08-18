/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.StoneTypeDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.StoneTypeDto;
import com.titan.poss.product.dto.request.StoneTypeUpdateDto;
import com.titan.poss.product.dto.response.StoneTypeLiteDto;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.repository.StoneRepositoryExt;
import com.titan.poss.product.repository.StoneTypeRepositoryExt;
import com.titan.poss.product.service.StoneTypeService;
import com.titan.poss.product.sync.dto.StoneTypeSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("stoneTypeService")
public class StoneTypeServiceImpl implements StoneTypeService {

	private static final String ERR_PRO_009 = "ERR-PRO-009";

	private static final String NO_STONETYPE_DETAILS_FOUND_FOR_THE_REQUESTED_STONETYPECODE = "No StoneType details found for the requested stoneTypeCode";

	private static final String ERR_PRO_018 = "ERR-PRO-018";

	private static final String STONE_TYPE_CODE_IS_ALREADY_AVAILABLE = "StoneTypeCode is already available";

	@Autowired
	private StoneTypeRepositoryExt stoneTypeRepository;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;

	@Autowired
	private StoneTypeServiceImpl stoneTypeService;

	@Autowired
	private StoneRepositoryExt stoneRepository;

	/**
	 * This method will return the list of StoneType details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StoneTypeDto>>
	 */
	@Override
	public PagedRestResponse<List<StoneTypeDto>> listStoneType(Boolean isActive, Pageable pageable) {

		StoneTypeDao stoneTypeCriteria = new StoneTypeDao();
		stoneTypeCriteria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StoneTypeDao> criteria = Example.of(stoneTypeCriteria, matcher);

		Page<StoneTypeDao> stoneTypeList = stoneTypeRepository.findAll(criteria, pageable);

		List<StoneTypeDto> stoneTypeDtoList = new ArrayList<>();

		stoneTypeList.forEach(stoneType -> {
			StoneTypeDto stoneTypeDto = (StoneTypeDto) MapperUtil.getObjectMapping(stoneType, new StoneTypeDto());
			stoneTypeDto.setConfigDetails(MapperUtil.getJsonFromString(stoneType.getConfigDetails()));
			stoneTypeDtoList.add(stoneTypeDto);
		});

		return (new PagedRestResponse<>(stoneTypeDtoList, stoneTypeList));

	}

	/**
	 * This method will return the list of StoneType details based on the
	 * isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<StoneTypeLiteDto>>
	 */
	@Override
	public PagedRestResponse<List<StoneTypeLiteDto>> listStoneTypeLite(Boolean isPageable, String stoneTypeCode,
			Pageable pageable) {
		
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		StoneTypeDao stoneTypeCriteria = new StoneTypeDao();
		stoneTypeCriteria.setStoneTypeCode(stoneTypeCode);
		stoneTypeCriteria.setIsActive(true);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StoneTypeDao> criteria = Example.of(stoneTypeCriteria, matcher);
		Page<StoneTypeDao> stoneTypeList = stoneTypeRepository.findAll(criteria, pageable);
		List<StoneTypeLiteDto> stoneTypeLiteDtoList = new ArrayList<>();
		stoneTypeList.forEach(stoneType -> {
			StoneTypeLiteDto stoneTypeLiteDto = (StoneTypeLiteDto) MapperUtil.getObjectMapping(stoneType,
					new StoneTypeLiteDto());
			stoneTypeLiteDtoList.add(stoneTypeLiteDto);
		});
		return (new PagedRestResponse<>(stoneTypeLiteDtoList, stoneTypeList));
	}

	/**
	 * This method will return the StoneType details based on the stoneTypeCode.
	 * 
	 * @param stoneTypeCode
	 * @return StoneTypeDto
	 */
	@Override
	public StoneTypeDto getStoneType(String stoneTypeCode) {

		StoneTypeDao stoneType = stoneTypeRepository.findOneByStoneTypeCode(stoneTypeCode);

		if (stoneType == null) {
			throw new ServiceException(NO_STONETYPE_DETAILS_FOUND_FOR_THE_REQUESTED_STONETYPECODE, ERR_PRO_009);
		}

		StoneTypeDto stoneTypeDto = (StoneTypeDto) MapperUtil.getObjectMapping(stoneType, new StoneTypeDto());

		stoneTypeDto.setConfigDetails(MapperUtil.getJsonFromString(stoneType.getConfigDetails()));

		return stoneTypeDto;

	}

	/**
	 * This method will save the StoneType details.
	 * 
	 * @param stoneTypeDto
	 * @return StoneTypeDto
	 */
	@Override
	public StoneTypeDto addStoneType(StoneTypeDto stoneTypeDto) {

		StoneTypeDao stoneType = stoneTypeRepository.findOneByStoneTypeCode(stoneTypeDto.getStoneTypeCode());

		if (stoneType != null) {
			throw new ServiceException(STONE_TYPE_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_018);
		}

		stoneType = (StoneTypeDao) MapperUtil.getObjectMapping(stoneTypeDto, new StoneTypeDao());

		stoneType.setConfigDetails(MapperUtil.getStringFromJson(stoneTypeDto.getConfigDetails()));
		stoneType.setSrcSyncId(0);
		stoneType.setDestSyncId(0);
		SyncStagingDto data = stoneTypeService.saveStoneTypeToDB(stoneType, ProductOperationCodes.STONE_TYPE_ADD);
		syncDataService.publishProductMessagesToQueue(data);

		return stoneTypeDto;
	}

	/**
	 * This method will update the StoneType details.
	 * 
	 * @param stoneTypeCode
	 * @param stoneTypeUpdateDto
	 * @return StoneTypeDto
	 */
	@Override
	public StoneTypeDto updateStoneType(String stoneTypeCode, StoneTypeUpdateDto stoneTypeUpdateDto) {

		StoneTypeDao stoneType = stoneTypeRepository.findOneByStoneTypeCode(stoneTypeCode);

		if (stoneType == null) {
			throw new ServiceException(NO_STONETYPE_DETAILS_FOUND_FOR_THE_REQUESTED_STONETYPECODE, ERR_PRO_009);
		}

		String configDetails = stoneType.getConfigDetails();

		Object configDetailsPatch = stoneTypeUpdateDto.getConfigDetails();

		if (configDetailsPatch != null) {

			configDetails = MapperUtil.mergeJsonObjects(configDetailsPatch,
					MapperUtil.getJsonFromString(configDetails));

		}

		stoneType = (StoneTypeDao) MapperUtil.getObjectMapping(stoneTypeUpdateDto, stoneType);

		stoneType.setConfigDetails(configDetails);
		stoneType.setSrcSyncId(stoneType.getSrcSyncId() + 1);

		SyncStagingDto data = stoneTypeService.saveStoneTypeToDB(stoneType, ProductOperationCodes.STONE_TYPE_UPDATE);
		syncDataService.publishProductMessagesToQueue(data);
		StoneTypeDto stoneTypeDto = (StoneTypeDto) MapperUtil.getObjectMapping(stoneType, new StoneTypeDto());

		stoneTypeDto.setConfigDetails(MapperUtil.getJsonFromString(stoneType.getConfigDetails()));

		return stoneTypeDto;

	}

	/**
	 * @param brandDto
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveStoneTypeToDB(StoneTypeDao stoneTypeDao, String operation) {
		StoneTypeDao savedStoneType = stoneTypeRepository.save(stoneTypeDao);
		List<SyncData> syncDataList = new ArrayList<>();
		StoneTypeSyncDto stoneTypeSyncDto = new StoneTypeSyncDto(savedStoneType);
		syncDataList.add(DataSyncUtil.createSyncData(stoneTypeSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest stoneTypeMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(stoneTypeMsgRequest);
		syncStagingDto.setMessageRequest(stoneTypeMsgRequest);
		SyncStaging stoneTypeStaggingMsg = new SyncStaging();
		stoneTypeStaggingMsg.setMessage(requestBody);
		stoneTypeStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		stoneTypeStaggingMsg = productSyncStagingRepository.save(stoneTypeStaggingMsg);
		syncStagingDto.setId(stoneTypeStaggingMsg.getId());
		return syncStagingDto;
	}

	@Override
	public StoneTypeDao getStoneTypeDao(String stoneTypeCode) {
		return stoneTypeRepository.findOneByStoneTypeCode(stoneTypeCode);
	}

	@Override
	public PagedRestResponse<List<String>> listStoneQualityLite(Pageable pageable) {
		List<String> qualityLists = new ArrayList<>();
		Page<String> qualityDetails = stoneRepository.getStoneQuality(pageable);
		for (String record : qualityDetails) {
			qualityLists.add(record);
		}
		return new PagedRestResponse<>(qualityLists, qualityDetails);
	}

}
