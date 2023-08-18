/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.ExchangeConfigLocationMappingDao;
import com.titan.poss.config.dto.ExchangeConfigLocationSyncDto;
import com.titan.poss.config.repository.ExchangeConfigLocationMappingRepository;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ExchangeConfigLocationSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	ExchangeConfigLocationMappingRepository exchangeConfigLocationRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeConfigLocationSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.EXCHANGE_CONFIG_LOCATION_ADD)) {
				ExchangeConfigLocationMappingDao sourceGepConfigLoc = getSource(data.getData());
				ExchangeConfigLocationMappingDao destGepConfigLocations = getDestination(sourceGepConfigLoc);
				saveToDestinationDB(sourceGepConfigLoc, destGepConfigLocations, data.getOrder());
			}
		});
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param destGepConfigLocations
	 * @param sourceGepConfigLoc
	 * @param order
	 */
	private void saveToDestinationDB(ExchangeConfigLocationMappingDao sourceExchangeConfigLoc,
			ExchangeConfigLocationMappingDao destGepConfigLocations, int order) {
		try {
			if (destGepConfigLocations == null) {
				if (order == 1)
					exchangeConfigLocationRepository.save(sourceExchangeConfigLoc);
			} else {
				if (sourceExchangeConfigLoc.getSyncTime() >= destGepConfigLocations.getSyncTime()) {
					if (order == 1) {
						exchangeConfigLocationRepository.delete(destGepConfigLocations);
						exchangeConfigLocationRepository.flush();
						exchangeConfigLocationRepository.save(sourceExchangeConfigLoc);
					}
					if (order == 0) {
						exchangeConfigLocationRepository.delete(destGepConfigLocations);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			}
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}

	}

	/**
	 * @param sourceGepConfigDetails
	 * @return GepConfigLocationMappingDao
	 */
	private ExchangeConfigLocationMappingDao getDestination(
			ExchangeConfigLocationMappingDao sourceExchangeConfigLoc) {
		return exchangeConfigLocationRepository.findByConfigTypeAndLocationCode(sourceExchangeConfigLoc.getConfigType(),
						sourceExchangeConfigLoc.getLocationCode());
	}

	/**
	 * @param data
	 * @return GepConfigLocationMappingDao
	 */
	private ExchangeConfigLocationMappingDao getSource(Object data) {
		ExchangeConfigLocationSyncDto syncDto = new ExchangeConfigLocationSyncDto();
		ObjectMapper mapper = new ObjectMapper();
		return syncDto.getGepConfigLocationMappingDao(
				mapper.convertValue(data, new TypeReference<ExchangeConfigLocationSyncDto>() {
				}));
	}
}
