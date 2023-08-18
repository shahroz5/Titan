/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.MetalPriceConfigDao;
import com.titan.poss.location.dao.MetalPriceLocationHistoryDao;
import com.titan.poss.location.dao.MetalPriceLocationMappingDao;
import com.titan.poss.location.dto.MetalPriceConfigSyncDto;
import com.titan.poss.location.dto.MetalPriceLocationHistorySyncDto;
import com.titan.poss.location.dto.MetalPriceLocationMappingSyncDto;
import com.titan.poss.location.repository.MetalPriceConfigRepository;
import com.titan.poss.location.repository.MetalPriceLocationHistoryRepository;
import com.titan.poss.location.repository.MetalPriceLocationMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class MetalPriceLocationMappingSyncService implements SyncOperation {

	@Autowired
	private MetalPriceConfigRepository metalPriceConfigRepository;

	@Autowired
	private MetalPriceLocationMappingRepository metalPriceLocationMappingRepository;

	@Autowired
	private MetalPriceLocationHistoryRepository metalPriceLocationHistoryRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(MetalPriceLocationMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		Map<Integer, Boolean> statusMap = new HashMap<>();
		statusMap.put(1, false);
		statusMap.put(2, false);
		syncData.forEach(data -> {

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.METAL_PRICE_LOCATION_MAPPING)) {

				ObjectMapper mapper = new ObjectMapper();
				try {
					if (data.getOrder() == 0) {
						MetalPriceConfigSyncDto metalPriceConfigSyncDto = new MetalPriceConfigSyncDto();
						MetalPriceConfigDao metalPriceConfig = metalPriceConfigSyncDto.getMetalPriceConfigDao(
								mapper.convertValue(data.getData(), new TypeReference<MetalPriceConfigSyncDto>() {
								}));
						metalPriceConfigRepository.save(metalPriceConfig);
					} else if (data.getOrder() == 1 || data.getOrder() == 2) {
						
						compareSourceAndDestinationTime(data, statusMap);

					} else if (data.getOrder() == 3) {
						MetalPriceLocationHistorySyncDto syncDto = new MetalPriceLocationHistorySyncDto();
						MetalPriceLocationHistoryDao sourceList = syncDto.getDao(mapper.convertValue(data.getData(),
								new TypeReference<MetalPriceLocationHistorySyncDto>() {
								}));
						if (statusMap.get(2).booleanValue()) {
							metalPriceLocationHistoryRepository.save(sourceList);
							LOGGER.info("History Saved");
							ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
						}
					}

				} catch (Exception ex) {
					LOGGER.error(EXCEPTION, ex);
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
				}

			}

		});
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}


	/**
	 * @param data
	 * @param Map<Integer, Boolean> statusMap
	 */
	private void compareSourceAndDestinationTime(SyncData data, Map<Integer, Boolean> statusMap) {
		ObjectMapper mapper = new ObjectMapper();
		MetalPriceLocationMappingSyncDto syncDto = new MetalPriceLocationMappingSyncDto();
		MetalPriceLocationMappingDao source = syncDto
				.getDao(mapper.convertValue(data.getData(), new TypeReference<MetalPriceLocationMappingSyncDto>() {
				}));
		MetalPriceLocationMappingDao dest = metalPriceLocationMappingRepository.findByUniqueCombination(
				source.getLocation().getLocationCode(), source.getMetalTypeCode(), source.getApplicableDate());
		if (dest != null) {
			long difference = source.getSyncTime() - dest.getSyncTime();
			if (difference >= 0 && data.getOrder() == 1) {
				metalPriceLocationMappingRepository.delete(dest);
				statusMap.replace(data.getOrder(), true);
				LOGGER.info("Old Record Deleted");
			}
			if (difference > 0 && data.getOrder() == 2 && statusMap.get(1).booleanValue()) {
				metalPriceLocationMappingRepository.save(source);
				statusMap.replace(data.getOrder(), true);
				LOGGER.info("New Record Inserted");
				ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
			} else {
				ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
			}
		}
		else if (data.getOrder() == 2) {
			metalPriceLocationMappingRepository.save(source);
			statusMap.replace(data.getOrder(), true);
			LOGGER.info("New Record Inserted");
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		}
	}

}
