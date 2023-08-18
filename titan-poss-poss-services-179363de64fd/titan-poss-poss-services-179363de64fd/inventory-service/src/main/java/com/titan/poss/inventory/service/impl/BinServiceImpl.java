/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.dao.BinDaoExt;
import com.titan.poss.inventory.dao.BinGroupDao;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.BinSyncDtoExt;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.BinRequestType;
import com.titan.poss.inventory.dto.request.BinCreateDto;
import com.titan.poss.inventory.dto.request.BinUpdateDto;
import com.titan.poss.inventory.dto.response.BinDetailsDto;
import com.titan.poss.inventory.dto.response.BinDto;
import com.titan.poss.inventory.dto.response.BinGroupCodeDto;
import com.titan.poss.inventory.repository.BinRepositoryExt;
import com.titan.poss.inventory.repository.InventoryDetailsRepositoryExt;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.service.BinService;
import com.titan.poss.inventory.service.InventorySyncDataService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("binService")
@Transactional
public class BinServiceImpl implements BinService {

	private static final String ERR_INV_029 = "ERR-INV-029";

	private static final String ERR_INV_033 = "ERR-INV-033";

	private static final String NO_BIN_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_CODE_AND_ISACTIVE = "No Bin details found for the requested binCode and isActive";

	private static final String NO_BIN_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_GROUP_CODE_AND_BIN_CODE = "No Bin details found for the requested binGroupCode and binCode";

	private static final String CANNOT_DEACTIVATE_BIN_WHICH_HAS_ITEMS = "Cannot deactivate Bin which has items";

	@Autowired
	private BinRepositoryExt binRepository;

	@Autowired
	private InventoryDetailsRepositoryExt invDetailsRepository;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Autowired
	private BinServiceImpl binService;

	/**
	 * This method will return the list of Bins based on binRequestType and
	 * userType.
	 * 
	 * @param binRequestType
	 * @param userType
	 * @return ListResponse<BinDetailsDto>
	 */
	@Override
	public ListResponse<BinDetailsDto> listBin(String binRequestType, UserTypeEnum userType) {
		List<String> binGroupCodeList = null;
		List<BinDetailsDto> binDetailsDtoList = new ArrayList<>();
		if (binRequestType.equals(BinRequestType.ISSUE_BIN.toString())) {
			binGroupCodeList = BinGroupEnum.issueBin(userType);
			if (binGroupCodeList.isEmpty()) {
				return new ListResponse<>(binDetailsDtoList);
			}
		} else {
			if (binRequestType.equals(BinRequestType.RECEIVE_BIN.toString())) {
				binGroupCodeList = BinGroupEnum.receiveBin(userType);
				if (binGroupCodeList.isEmpty()) {
					return new ListResponse<>(binDetailsDtoList);
				}
			} else {
				return new ListResponse<>(binDetailsDtoList);
			}
		}
		List<BinDaoExt> binList = binRepository.listBin(binGroupCodeList, true);
		binList.forEach(bin -> {
			BinDetailsDto binDetailsDto = new BinDetailsDto();
			binDetailsDto.setBinCode(bin.getBinCode());
			binDetailsDto.setBinGroupCode(bin.getBinGroup().getBinGroupCode());
			binDetailsDtoList.add(binDetailsDto);
		});
		return new ListResponse<>(binDetailsDtoList);
	}

	@Override
	public List<String> getBinGroupList(String binRequestType, UserTypeEnum userType) {
		List<String> binGroupCodeList = null;
		if (binRequestType.equals(BinRequestType.ISSUE_BIN.toString())) {
			binGroupCodeList = BinGroupEnum.issueBin(userType);

		} else if (binRequestType.equals(BinRequestType.RECEIVE_BIN.toString())) {
			binGroupCodeList = BinGroupEnum.receiveBin(userType);

		}

		return binGroupCodeList;

	}

	/**
	 * This method will return the Bin details based on the binCode and isActive.
	 * 
	 * @param binCode
	 * @param isActive
	 * @return BinDto
	 */
	@Override
	public BinDto getBin(String binCode, String binGroupCode, Boolean isActive) {
		BinDaoExt binCriteria = new BinDaoExt();
		binCriteria.setBinCode(binCode);
		if (binGroupCode != null) {
			BinGroupDao binGroup = new BinGroupDao();
			binGroup.setBinGroupCode(binGroupCode);
			binCriteria.setBinGroup(binGroup);
		}

		binCriteria.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<BinDaoExt> criteria = Example.of(binCriteria, matcher);
		List<BinDaoExt> binList = binRepository.findAll(criteria);
		if (binList.isEmpty()) {
			throw new ServiceException(NO_BIN_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_CODE_AND_ISACTIVE, ERR_INV_029);
		}
		return convertListToDto(binList);
	}

	/**
	 * This method will save the Bin details.
	 * 
	 * @param binCreateDto
	 * @return BinDto
	 */
	@Override
	public BinDto addBin(BinCreateDto binCreateDto) {
		List<BinDaoExt> binList = new ArrayList<>();
		List<String> binGroups = binCreateDto.getBinGroups();
		for (String binGroupCode : binGroups) {
			BinDaoExt bin = new BinDaoExt();
			bin.setBinCode(binCreateDto.getBinCode());
			bin.setDescription(binCreateDto.getDescription());
			bin.setIsActive(true);
			BinGroupDao binGroup = new BinGroupDao();
			binGroup.setBinGroupCode(binGroupCode);
			bin.setBinGroup(binGroup);
			bin.setSrcSyncId(0);
			bin.setDestSyncId(0);
			binList.add(bin);
		}
		SyncStagingDto syncStaging = binService.saveBin(binList, InventoryOperationCodes.BIN_ADD);
		inventorySyncDataService.publishInventoryMessagesToQueue(syncStaging);
		return convertListToDto(binList);
	}

	/**
	 * @param binList
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveBin(List<BinDaoExt> binList, String operation) {
		binList = binRepository.saveAll(binList);
		List<String> destinations = new ArrayList<>();
		List<SyncData> syncDataList = new ArrayList<>();
		BinSyncDtoExt binSyncDto = new BinSyncDtoExt();
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncDataList.add(DataSyncUtil.createSyncData(binSyncDto.getBinSyncDtoList(binList), 0));
		MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(messageRequest);
		syncStagingDto.setMessageRequest(messageRequest);
		// saving to staging table
		SyncStaging stagingMessage = new SyncStaging();
		stagingMessage.setMessage(requestBody);
		stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		stagingMessage = inventorySyncStagingRepository.save(stagingMessage);
		syncStagingDto.setId(stagingMessage.getId());
		return syncStagingDto;
	}

	/**
	 * This method will update the Bin details based on the binCode.
	 * 
	 * @param binCode
	 * @param binUpdateDto
	 * @return BinUpdateDto
	 */
	@Override
	public BinUpdateDto updateBin(String binCode, BinUpdateDto binUpdateDto) {
		BinGroupDao binGroup = new BinGroupDao();
		binGroup.setBinGroupCode(binUpdateDto.getBinGroupCode());
		BinDaoExt bin = binRepository.findOneByBinGroupAndBinCode(binGroup, binCode);
		if (bin == null) {
			throw new ServiceException(NO_BIN_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_GROUP_CODE_AND_BIN_CODE + "binGroup: "
					+ binGroup + " binCode: " + binCode, ERR_INV_029);
		}
		if (bin.getIsActive().booleanValue() && !binUpdateDto.getIsActive().booleanValue()) {
			InventoryDetailsDaoExt invCriteria = new InventoryDetailsDaoExt();
			invCriteria.setBinGroupCode(binUpdateDto.getBinGroupCode());
			invCriteria.setBinCode(binCode);
			ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
			Example<InventoryDetailsDaoExt> criteria = Example.of(invCriteria, matcher);
			if (invDetailsRepository.exists(criteria)) {
				throw new ServiceException(CANNOT_DEACTIVATE_BIN_WHICH_HAS_ITEMS, ERR_INV_033);
			}
		}
		bin = (BinDaoExt) MapperUtil.getObjectMapping(binUpdateDto, bin);
		bin.setSrcSyncId(bin.getSrcSyncId() + 1);
		List<BinDaoExt> binList = new ArrayList<>();
		binList.add(bin);
		SyncStagingDto syncStaging = binService.saveBin(binList, InventoryOperationCodes.BIN_UPDATE);
		BinUpdateDto binUpdateDtoRes = (BinUpdateDto) MapperUtil.getObjectMapping(bin, new BinUpdateDto());
		binUpdateDtoRes.setBinGroupCode(binUpdateDto.getBinGroupCode());
		inventorySyncDataService.publishInventoryMessagesToQueue(syncStaging);
		return binUpdateDtoRes;
	}

	/**
	 * This method will convert list of Bin details to BinDto.
	 * 
	 * @param binList
	 * @return BinDto
	 */
	private BinDto convertListToDto(List<BinDaoExt> binList) {
		BinDto binDto = (BinDto) MapperUtil.getObjectMapping(binList.get(0), new BinDto());
		List<BinGroupCodeDto> binGroupCodeList = new ArrayList<>();
		binList.forEach(bin -> {
			BinGroupCodeDto binGroupCodeDto = new BinGroupCodeDto();
			binGroupCodeDto.setBinGroupCode(bin.getBinGroup().getBinGroupCode());
			binGroupCodeDto.setIsActive(bin.getIsActive());
			binGroupCodeList.add(binGroupCodeDto);
		});
		binDto.setBinGroups(binGroupCodeList);
		return binDto;
	}

	@Override
	public BinDaoExt getBinDao(String binCode, String binGroup) {
		return binRepository.findOneByBinGroupBinGroupCodeAndBinCode(binGroup, binCode);
	}
}
