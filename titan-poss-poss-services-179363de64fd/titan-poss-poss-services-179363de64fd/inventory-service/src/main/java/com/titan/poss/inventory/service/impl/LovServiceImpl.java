/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.constant.LovTypeEnum;
import com.titan.poss.inventory.dao.InvLovDaoExt;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.request.LovUpdateDto;
import com.titan.poss.inventory.dto.response.KeyValueDto;
import com.titan.poss.inventory.dto.response.LovCreateDto;
import com.titan.poss.inventory.dto.response.LovDto;
import com.titan.poss.inventory.dto.response.LovTypesDto;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.repository.LovRepository;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.LovService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("InventoryLovService")
public class LovServiceImpl implements LovService {

	private static final String ERR_INV_031 = "ERR-INV-031";

	private static final String LOVTYPE_AND_CODE_IS_ALREADY_AVAILABLE = "LovType and code is already available";

	@Autowired
	private LovRepository lovRepository;

	@Autowired
	private LovServiceImpl lovServiceImp;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@Override
	public LovTypesDto getLovTypes() {
		LovTypeEnum[] lovTypeEnumList = LovTypeEnum.values();
		List<String> lovTypes = new ArrayList<>();
		for (LovTypeEnum lovTypeEnum : lovTypeEnumList) {
			lovTypes.add(lovTypeEnum.toString());
		}
		LovTypesDto lovTypesDto = new LovTypesDto();
		lovTypesDto.setLovTypes(lovTypes);
		return lovTypesDto;
	}

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@Override
	public LovDto getLov(String lovType, Boolean isActive) {
		List<InvLovDaoExt> invLovList=new ArrayList<>();
		if(BooleanUtils.isTrue(isActive)) {
			invLovList = lovRepository.findByLovTypeAndIsActive(lovType,isActive);
		} else {
		   invLovList = lovRepository.findByLovType(lovType);
		}
		
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!invLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoList = new ArrayList<>();
			invLovList.forEach(invLov -> keyValueDtoList
					.add((KeyValueDto) MapperUtil.getObjectMapping(invLov, new KeyValueDto())));
			lovDto.setResults(keyValueDtoList);
		} else {
			lovDto.setResults(new ArrayList<KeyValueDto>());
		}
		return lovDto;
	}

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@Override
	public LovCreateDto createLov(LovCreateDto lovCreateDto) {
		InvLovDaoExt invLovCriteria = new InvLovDaoExt();
		invLovCriteria.setLovType(lovCreateDto.getLovType());
		invLovCriteria.setCode(lovCreateDto.getCode());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<InvLovDaoExt> criteria = Example.of(invLovCriteria, matcher);
		Optional<InvLovDaoExt> invLovOpt = lovRepository.findOne(criteria);
		if (!invLovOpt.isEmpty()) {
			throw new ServiceException(LOVTYPE_AND_CODE_IS_ALREADY_AVAILABLE, ERR_INV_031);
		}
		InvLovDaoExt invLov = (InvLovDaoExt) MapperUtil.getObjectMapping(lovCreateDto, new InvLovDaoExt());
		invLov.setIsActive(true);
		invLov.setLovType(lovCreateDto.getLovType());
		List<InvLovDaoExt> invLovList = new ArrayList<>();
		invLovList.add(invLov);
		SyncStagingDto syncStagingDto = lovServiceImp.saveLovAndStaging(invLovList,
				InventoryOperationCodes.INV_LOV_ADD);

		inventorySyncDataService.publishInventoryMessagesToQueue(syncStagingDto);
		return lovCreateDto;
	}

	/**
	 * @param invLovList
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveLovAndStaging(List<InvLovDaoExt> invLovList, String operation) {

		invLovList = lovRepository.saveAll(invLovList);
		List<SyncData> invLovSyncData = new ArrayList<>();
		invLovSyncData.add(DataSyncUtil.createSyncData(invLovList, 0));
		List<String> destinations = new ArrayList<>();
		destinations.add("EGHS");
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest invLovMsgRequest = DataSyncUtil.createMessageRequest(invLovSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
		String requestBody = MapperUtil.getJsonString(invLovMsgRequest);
		syncStagingDto.setMessageRequest(invLovMsgRequest);
		SyncStaging invLovStaggingMsg = new SyncStaging();
		invLovStaggingMsg.setMessage(requestBody);
		invLovStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		invLovStaggingMsg = inventorySyncStagingRepository.save(invLovStaggingMsg);
		syncStagingDto.setId(invLovStaggingMsg.getId());
		return syncStagingDto;
	}

	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@Override
	public LovDto updateLov(String lovType, LovUpdateDto lovUpdateDto) {
		List<InvLovDaoExt> invLovList = lovRepository.findByLovType(lovType);
		int size = invLovList.size();
		List<KeyValueDto> keyValueDtoList = lovUpdateDto.getValues();
		int sizeDto = keyValueDtoList.size();
		for (int i = 0; i < sizeDto; i++) {
			Integer index = null;
			for (int j = 0; j < size; j++) {
				if (invLovList.get(j).getCode().equalsIgnoreCase(keyValueDtoList.get(i).getCode())) {
					index = j;
					break;
				}
			}
			if (index != null) {
				InvLovDaoExt invLov = invLovList.get(index);
				invLov.setValue(keyValueDtoList.get(i).getValue());
				invLov.setIsActive(keyValueDtoList.get(i).getIsActive());
				invLovList.set(index, invLov);
			} else {
				InvLovDaoExt invLov = new InvLovDaoExt();
				invLov.setLovType(lovType);
				invLov.setCode(keyValueDtoList.get(i).getCode());
				invLov.setValue(keyValueDtoList.get(i).getValue());
				invLov.setIsActive(keyValueDtoList.get(i).getIsActive());
				invLovList.add(invLov);
			}
		}
		SyncStagingDto syncStagingDto = lovServiceImp.saveLovAndStaging(invLovList,
				InventoryOperationCodes.INV_LOV_UPDATE);

		inventorySyncDataService.publishInventoryMessagesToQueue(syncStagingDto);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!invLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoResList = new ArrayList<>();
			invLovList.forEach(invLov -> keyValueDtoResList
					.add((KeyValueDto) MapperUtil.getObjectMapping(invLov, new KeyValueDto())));
			lovDto.setResults(keyValueDtoResList);
		} else {
			lovDto.setResults(new ArrayList<KeyValueDto>());
		}
		return lovDto;
	}
}
