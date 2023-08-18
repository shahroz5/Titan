/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.dao.BinCodeLocationMappingDaoExt;
import com.titan.poss.inventory.dao.BinDaoExt;
import com.titan.poss.inventory.dao.BinGroupDao;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.BinCodeLocationMappingSyncDtoExt;
import com.titan.poss.inventory.dto.BinGroupSyncDto;
import com.titan.poss.inventory.dto.request.BinGroupUpdateDto;
import com.titan.poss.inventory.dto.response.BinCodeDto;
import com.titan.poss.inventory.dto.response.BinCodeLiteDto;
import com.titan.poss.inventory.dto.response.BinGroupDto;
import com.titan.poss.inventory.dto.response.BinLocationDto;
import com.titan.poss.inventory.dto.response.LocationCodeDto;
import com.titan.poss.inventory.repository.BinCodeLocationRepositoryExt;
import com.titan.poss.inventory.repository.BinGroupRepositoryExt;
import com.titan.poss.inventory.repository.BinRepositoryExt;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.service.BinGroupService;
import com.titan.poss.inventory.service.InventorySyncDataService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("binGroupService")
public class BinGroupServiceImpl implements BinGroupService {

	private static final String ERR_INV_038 = "ERR-INV-038";

	private static final String ERR_INV_039 = "ERR-INV-039";

	private static final String ERR_INV_040 = "ERR-INV-040";

	private static final String ERR_INV_041 = "ERR-INV-041";

	private static final String NO_BIN_GROUP_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_GROUP_CODE = "No BinGroup details found for the requested binGroupCode";

	private static final String NO_BIN_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_CODE = "No Bin details found for the requested binCode";

	private static final String BIN_GROUP_CODE_IS_ALREADY_AVAILABLE = "BinGroupCode is already available";

	private static final String CANNOT_DEACTIVATE_BIN_FOR_A_LOCATIONCODE_WHICH_HAS_ITEMS = "Cannot deactivate Bin for a locationCode which has items";

	@Autowired
	private BinGroupRepositoryExt binGroupRepository;

	@Autowired
	private BinRepositoryExt binRepository;

	@Autowired
	private BinCodeLocationRepositoryExt binCodeLocationRepository;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Autowired
	private BinGroupServiceImpl binGroupService;

	/**
	 * This method will return the list of BinGroup details based on isActive,
	 * locationCode and isPageable.
	 * 
	 * @param isActive
	 * @param locationCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinGroupDto>>
	 */
	@Override
	public PagedRestResponse<List<BinGroupDto>> listBinGroup(Boolean isActive, String locationCode, Boolean isPageable,
			Pageable pageable) {
		if (StringUtils.isEmpty(locationCode)) {
			if (!isPageable.booleanValue()) {
				pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
			}
			BinGroupDao binGroupCriteria = new BinGroupDao();
			binGroupCriteria.setIsActive(isActive);
			ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
			Example<BinGroupDao> criteria = Example.of(binGroupCriteria, matcher);
			Page<BinGroupDao> binGroupList = binGroupRepository.findAll(criteria, pageable);
			List<BinGroupDto> binGroupDtoList = new ArrayList<>();
			binGroupList.forEach(binGroup -> binGroupDtoList
					.add((BinGroupDto) MapperUtil.getObjectMapping(binGroup, new BinGroupDto())));

			return new PagedRestResponse<>(binGroupDtoList, binGroupList);
		} else {
			if (!isPageable.booleanValue()) {
				pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
			}
			Page<BinGroupDao> binGroupList;
			if (isActive == null) {
				binGroupList = binCodeLocationRepository.pageBinGroup(locationCode, pageable);
			} else {
				binGroupList = binCodeLocationRepository.pageBinGroup(locationCode, isActive, pageable);
			}
			List<BinGroupDto> binGroupDtoList = new ArrayList<>();
			binGroupList.forEach(binGroup -> binGroupDtoList
					.add((BinGroupDto) MapperUtil.getObjectMapping(binGroup, new BinGroupDto())));
			return new PagedRestResponse<>(binGroupDtoList, binGroupList);
		}
	}

	/**
	 * This method will return the BinGroup details based on the binGroupCode.
	 * 
	 * @param binGroupCode
	 * @return BinGroupDto
	 */
	@Override
	public BinGroupDto getBinGroup(String binGroupCode) {
		BinGroupDao binGroup = binGroupRepository.findOneByBinGroupCode(binGroupCode);
		if (binGroup == null) {
			throw new ServiceException(NO_BIN_GROUP_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_GROUP_CODE, ERR_INV_038);
		}
		return (BinGroupDto) MapperUtil.getObjectMapping(binGroup, new BinGroupDto());
	}

	/**
	 * This method will save the BinGroup details.
	 * 
	 * @param binGroupDto
	 * @return BinGroupDto
	 */
	@Override
	public BinGroupDto addBinGroup(BinGroupDto binGroupDto) {
		BinGroupDao binGroup = binGroupRepository.findOneByBinGroupCode(binGroupDto.getBinGroupCode());
		if (binGroup != null) {
			throw new ServiceException(BIN_GROUP_CODE_IS_ALREADY_AVAILABLE, ERR_INV_040);
		}
		binGroup = (BinGroupDao) MapperUtil.getObjectMapping(binGroupDto, new BinGroupDao());
		binGroup.setSrcSyncId(0);
		binGroup.setDestSyncId(0);
		SyncStagingDto syncStaging = binGroupService.saveBinGroupToDB(binGroup, InventoryOperationCodes.BINGROUP_ADD);
		inventorySyncDataService.publishInventoryMessagesToQueue(syncStaging);
		return binGroupDto;
	}

	/**
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveBinGroupToDB(BinGroupDao binGroupDao, String operation) {
		BinGroupDao binGroup = binGroupRepository.save(binGroupDao);
		// Publishing to data sync queue
		List<String> destinations = new ArrayList<>();
		List<SyncData> syncDataList = new ArrayList<>();
		BinGroupSyncDto binGroupSyncDto = new BinGroupSyncDto(binGroup);
		syncDataList.add(DataSyncUtil.createSyncData(binGroupSyncDto, 0));
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		syncStagingDto.setMessageRequest(messageRequest);
		String requestBody = MapperUtil.getJsonString(messageRequest);
		// saving to staging table
		SyncStaging stagingMessage = new SyncStaging();
		stagingMessage.setMessage(requestBody);
		stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		stagingMessage = inventorySyncStagingRepository.save(stagingMessage);
		syncStagingDto.setId(stagingMessage.getId());
		return syncStagingDto;
	}

	/**
	 * This method will update the BinGroup details based on the binGroupCode.
	 * 
	 * @param binGroupCode
	 * @param binGroupUpdateDto
	 * @return BinGroupDto
	 */
	@Override
	public BinGroupDto updateBinGroup(String binGroupCode, BinGroupUpdateDto binGroupUpdateDto) {
		BinGroupDao binGroup = binGroupRepository.findOneByBinGroupCode(binGroupCode);
		if (binGroup == null) {
			throw new ServiceException(NO_BIN_GROUP_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_GROUP_CODE, ERR_INV_038);
		}
		binGroup = (BinGroupDao) MapperUtil.getObjectMapping(binGroupUpdateDto, binGroup);
		binGroup.setSrcSyncId(binGroup.getSrcSyncId() + 1);
		SyncStagingDto syncStaging = binGroupService.saveBinGroupToDB(binGroup,
				InventoryOperationCodes.BINGROUP_UPDATE);
		inventorySyncDataService.publishInventoryMessagesToQueue(syncStaging);
		return (BinGroupDto) MapperUtil.getObjectMapping(binGroup, new BinGroupDto());
	}

	/**
	 * This method will return the list of Bin details based on the binGroupCode,
	 * locationCode, isActive and isPageable.
	 * 
	 * @param binGroupCode
	 * @param locationCode
	 * @param isActive
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinCodeDto>>
	 */
	@Override
	public PagedRestResponse<List<BinCodeDto>> listBin(String binGroupCode, String locationCode, Boolean isActive,
			Boolean isPageable, Pageable pageable) {
		if (locationCode == null || locationCode.isEmpty()) {
			if (!isPageable.booleanValue()) {
				pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
			}
			BinGroupDao binGroup = new BinGroupDao();
			binGroup.setBinGroupCode(binGroupCode);
			BinDaoExt binCriteria = new BinDaoExt();
			binCriteria.setBinGroup(binGroup);
			binCriteria.setIsActive(isActive);
			ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
			Example<BinDaoExt> criteria = Example.of(binCriteria, matcher);
			Page<BinDaoExt> binList = binRepository.findAll(criteria, pageable);
			List<BinCodeDto> binCodeDtoList = new ArrayList<>();
			binList.forEach(bin -> binCodeDtoList.add((BinCodeDto) MapperUtil.getObjectMapping(bin, new BinCodeDto())));
			return new PagedRestResponse<>(binCodeDtoList, binList);
		} else {
			if (!isPageable.booleanValue()) {
				pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
			}
			Page<BinDaoExt> binList;
			if (isActive == null) {
				binList = binCodeLocationRepository.pageBin(binGroupCode, locationCode, pageable);
			} else {
				binList = binCodeLocationRepository.pageBin(binGroupCode, locationCode, isActive, pageable);
			}
			List<BinCodeDto> binCodeDtoList = new ArrayList<>();
			binList.forEach(bin -> binCodeDtoList.add((BinCodeDto) MapperUtil.getObjectMapping(bin, new BinCodeDto())));
			return new PagedRestResponse<>(binCodeDtoList, binList);
		}
	}

	/**
	 * This method will return the list of location codes based on binGroupCode,
	 * binCodes and isActive.
	 * 
	 * @param binGroupCode
	 * @param binCodes
	 * @param isActive
	 * @return List<LocationCodeDto>
	 */
	@Override
	public ListResponse<LocationCodeDto> getLocationCodes(String binGroupCode, List<String> binCodes,
			Boolean isActive) {
		List<LocationCodeDto> locationCodeDtos = null;
		if (isActive == null) {
			locationCodeDtos = binCodeLocationRepository.getLocationCodes(binGroupCode, binCodes,
					Long.valueOf(String.valueOf(binCodes.size())));
		} else {
			locationCodeDtos = binCodeLocationRepository.getLocationCodes(binGroupCode, binCodes, isActive,
					Long.valueOf(String.valueOf(binCodes.size())));
		}
		return new ListResponse<>(locationCodeDtos);
	}

	/**
	 * This method will create/remove mapping between BinGroup details and
	 * locations.
	 * 
	 * @param binGroupCode
	 * @param binLocationDto
	 * @return BinLocationDto
	 */
	@Override
	public BinLocationDto locationsMapping(String binGroupCode, BinLocationDto binLocationDto) {
		Set<String> binCodes = binLocationDto.getBinCodes();
		Set<String> addLocations = binLocationDto.getAddLocations();
		Set<String> removeLocations = binLocationDto.getRemoveLocations();
		List<BinCodeLocationMappingDaoExt> binCodeLocList = new ArrayList<>();
		List<BinCodeLocationMappingDaoExt> delBinCodeLocList = new ArrayList<>();
		binCodes.forEach(binCode -> {
			BinGroupDao binGroup = new BinGroupDao();
			binGroup.setBinGroupCode(binGroupCode);
			BinDaoExt bin = binRepository.findOneByBinGroupAndBinCode(binGroup, binCode);
			if (bin == null) {
				throw new ServiceException(NO_BIN_DETAILS_FOUND_FOR_THE_REQUESTED_BIN_CODE, ERR_INV_039);
			}
			if (!removeLocations.isEmpty()) {
				getRemoveBinLocationList(binGroupCode, binCode, removeLocations, bin, binCodeLocList);
			}
			if (!addLocations.isEmpty()) {
				getAddBinLocMappingList(binCodeLocList, addLocations, delBinCodeLocList, bin);
			}
		});
		Map<String, SyncStagingDto> locationSyncDataMap = binGroupService.saveAndDeleteLocMapping(binCodeLocList,
				delBinCodeLocList, addLocations, removeLocations);
		if (!locationSyncDataMap.isEmpty()) {
			for (Map.Entry<String, SyncStagingDto> entry : locationSyncDataMap.entrySet()) {
				List<String> destinations = new ArrayList<>();
				destinations.add(entry.getKey());
				inventorySyncDataService.publishInventoryMessagesToQueue(entry.getValue());
			}
		}
		return binLocationDto;
	}

	/**
	 * @param binGroupCode
	 * @param binCode
	 * @param removeLocations
	 * @param bin
	 * @param binCodeLocList
	 */
	private void getRemoveBinLocationList(String binGroupCode, String binCode, Set<String> removeLocations,
			BinDaoExt bin, List<BinCodeLocationMappingDaoExt> binCodeLocList) {
		List<InventoryDetailsDao> invDetailsList = binCodeLocationRepository.getInventoryDetails(binGroupCode, binCode,
				removeLocations);
		if (!invDetailsList.isEmpty()) {
			throw new ServiceException(CANNOT_DEACTIVATE_BIN_FOR_A_LOCATIONCODE_WHICH_HAS_ITEMS, ERR_INV_041);
		}
		List<BinCodeLocationMappingDaoExt> removeMapping = binCodeLocationRepository.getBinCodeLocationMapping(bin,
				removeLocations);
		if (!removeMapping.isEmpty()) {
			removeMapping.forEach(removeLoc -> {
				removeLoc.setSyncTime(new Date().getTime());
				removeLoc.setIsActive(false);
				binCodeLocList.add(removeLoc);
			});
		}

	}

	/**
	 * @param binCodeLocList
	 * @param addLocations
	 * @param delBinCodeLocList
	 * @param bin
	 */
	private void getAddBinLocMappingList(List<BinCodeLocationMappingDaoExt> binCodeLocList, Set<String> addLocations,
			List<BinCodeLocationMappingDaoExt> delBinCodeLocList, BinDaoExt bin) {
		addLocations.forEach(location -> {
			BinCodeLocationMappingDaoExt binCodeLocationMapping = new BinCodeLocationMappingDaoExt();
			binCodeLocationMapping.setId(UUID.randomUUID().toString());
			binCodeLocationMapping.setBin(bin);
			binCodeLocationMapping.setLocationCode(location);
			binCodeLocationMapping.setIsActive(true);
			binCodeLocationMapping.setSyncTime(new Date().getTime());
			binCodeLocList.add(binCodeLocationMapping);
		});
		List<BinCodeLocationMappingDaoExt> deleteMapping = binCodeLocationRepository.getBinCodeLocationMapping(bin,
				addLocations);
		if (!deleteMapping.isEmpty()) {
			deleteMapping.forEach(deleteLoc -> {
				deleteLoc.setSyncTime(new Date().getTime());
				delBinCodeLocList.add(deleteLoc);
			});
		}
	}

	/**
	 * @param binCodeLocList
	 * @param delBinCodeLocList
	 * @param binLocationMapping
	 * @param addLocations
	 * @param removeLocations
	 * @return Map<String, SyncStagingDto>
	 */
	public Map<String, SyncStagingDto> saveAndDeleteLocMapping(List<BinCodeLocationMappingDaoExt> binCodeLocList,
			List<BinCodeLocationMappingDaoExt> delBinCodeLocList, Set<String> addLocations,
			Set<String> removeLocations) {

		if (!delBinCodeLocList.isEmpty()) {
			binCodeLocationRepository.deleteAll(delBinCodeLocList);
			binCodeLocationRepository.flush();
		}
		if (!binCodeLocList.isEmpty()) {
			binCodeLocationRepository.saveAll(binCodeLocList);
		}
		Map<String, List<SyncData>> syncDataMap = new HashMap<>();
		if (!delBinCodeLocList.isEmpty())
			getSyncDataList(delBinCodeLocList, addLocations, syncDataMap, 0);
		if (!binCodeLocList.isEmpty()) {
			addLocations.addAll(removeLocations);
			getSyncDataList(binCodeLocList, addLocations, syncDataMap, 1);
		}
		Map<String, SyncStagingDto> locationSyncDataMap = new HashMap<>();
		for (Map.Entry<String, List<SyncData>> entry : syncDataMap.entrySet()) {
			List<String> destinations = new ArrayList<>();
			destinations.add(entry.getKey());
			locationSyncDataMap.put(entry.getKey(), binGroupService.saveSyncStaging(entry.getValue(),
					InventoryOperationCodes.BIN_LOCATION_MAPPING, destinations));
		}
		return locationSyncDataMap;
	}

	private void getSyncDataList(List<BinCodeLocationMappingDaoExt> binCodeLocList, Set<String> locations,
			Map<String, List<SyncData>> syncDataMap, int order) {
		for (String location : locations) {
			binCodeLocList.forEach(binCodeLoc -> {
				if (binCodeLoc.getLocationCode().equals(location)) {
					if (syncDataMap.containsKey(location)) {
						BinCodeLocationMappingSyncDtoExt syncDtoExt = new BinCodeLocationMappingSyncDtoExt(binCodeLoc);
						syncDataMap.get(location).add(DataSyncUtil.createSyncData(syncDtoExt, order));
					} else {
						List<SyncData> syncDatas = new ArrayList<>();
						BinCodeLocationMappingSyncDtoExt syncDtoExt = new BinCodeLocationMappingSyncDtoExt(binCodeLoc);
						syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt, order));
						syncDataMap.put(location, syncDatas);
					}
				}
			});
		}
	}

	/**
	 * @param syncDataList
	 * @param binLocationMapping
	 * @param addLocations
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveSyncStaging(List<SyncData> syncDataList, String operation, List<String> destinations) {
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
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
	 * This method will return the list of Bin details based on the binGroupCode,
	 * locationCode, isActive and isPageable.
	 * 
	 * @param binGroupCode
	 * @param locationCode
	 * @param isActive
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinCodeDto>>
	 */
	@Override
	public PagedRestResponse<List<BinCodeLiteDto>> listBinLite(String binGroupCode, Boolean isPageable,
			Pageable pageable) {
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		if (pageable.getSort().isEmpty()) {
			pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("bin.binCode"));
		}
		Page<BinDaoExt> binList;
		binList = binCodeLocationRepository.pageBin(binGroupCode,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), true, pageable);
		List<BinCodeLiteDto> binCodeDtoList = new ArrayList<>();
		binList.forEach(
				bin -> binCodeDtoList.add((BinCodeLiteDto) MapperUtil.getObjectMapping(bin, new BinCodeLiteDto())));
		return new PagedRestResponse<>(binCodeDtoList, binList);
	}

	@Override
	public BinGroupDao getBinGroupDao(String binGroupCode) {
		return binGroupRepository.findOneByBinGroupCode(binGroupCode);
	}
}
