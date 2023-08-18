/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.LocationPriceGroupMappingDao;
import com.titan.poss.location.dto.LocationPriceGroupMappingSyncDto;
import com.titan.poss.location.repository.LocationPriceGroupMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class LocationPriceGroupMappingSyncService implements SyncOperation {

	@Autowired
	private LocationPriceGroupMappingRepository locationPriceGroupMappingRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(LocationPriceGroupMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.LOCATION_PRICE_GROUP_MAPPING_UPDATE)) {

				List<LocationPriceGroupMappingDao> sourceList = getSourceList(data.getData());
				List<LocationPriceGroupMappingDao> destList = getDestinationList(sourceList);
				compareListsAndSave(sourceList, destList, messageId, data.getOrder());
			}

		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param sourceList
	 * @param destList
	 * @param order
	 * @param id
	 */
	@Transactional
	public void compareListsAndSave(List<LocationPriceGroupMappingDao> sourceList,
			List<LocationPriceGroupMappingDao> destList, String messageId, int order) {
		List<LocationPriceGroupMappingDao> lpgList = new ArrayList<>();
		for (LocationPriceGroupMappingDao locationPrcGrpMapping : sourceList) {
			boolean isNew = true;
			for (LocationPriceGroupMappingDao destination : destList) {

				if (locationPrcGrpMapping.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = compareSyncIdVersions(locationPrcGrpMapping, destination);
					if (status.equals(DatasyncStatusEnum.SYNCED)) {
						int tempSrcDataSyncId = locationPrcGrpMapping.getSrcSyncId();
						locationPrcGrpMapping.setSrcSyncId(locationPrcGrpMapping.getDestSyncId());
						locationPrcGrpMapping.setDestSyncId(tempSrcDataSyncId);
						lpgList.add(locationPrcGrpMapping);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = locationPrcGrpMapping.getSrcSyncId();
				locationPrcGrpMapping.setSrcSyncId(locationPrcGrpMapping.getDestSyncId());
				locationPrcGrpMapping.setDestSyncId(tempSrcDataSyncId);
				lpgList.add(locationPrcGrpMapping);
			}

		}

		saveToDestinationDB(lpgList, order);

	}

	/**
	 * @param order
	 * @param src   return DataSyncAuditDto
	 */
	@Transactional
	public void saveToDestinationDB(List<LocationPriceGroupMappingDao> locationPrcGrpMapping, int order) {

		try {
			if (order == 0)
				locationPriceGroupMappingRepository.deleteAll(locationPrcGrpMapping);
			if (order == 1)
				locationPriceGroupMappingRepository.saveAll(locationPrcGrpMapping);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}
	}

	/**
	 * @param src
	 * @param destination
	 * @param messageId
	 */
	private DatasyncStatusEnum compareSyncIdVersions(LocationPriceGroupMappingDao src,
			LocationPriceGroupMappingDao dest) {
		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());


	}

	/**
	 * @param sourceList
	 * @return
	 */
	private List<LocationPriceGroupMappingDao> getDestinationList(List<LocationPriceGroupMappingDao> sourceList) {
		List<String> ids = new ArrayList<>();
		sourceList.forEach(src -> ids.add(src.getId()));
		return locationPriceGroupMappingRepository.findAllById(ids);
	}

	/**
	 * @param data
	 * @return
	 */
	private List<LocationPriceGroupMappingDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		LocationPriceGroupMappingSyncDto syncDto = new LocationPriceGroupMappingSyncDto();
		return syncDto.getDao(mapper.convertValue(data, new TypeReference<List<LocationPriceGroupMappingSyncDto>>() {
		}));
	}

}
