/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.titan.poss.config.dao.ExchangeConfigDetailsDao;
import com.titan.poss.config.dto.ExchangeConfigDetailsSyncDto;
import com.titan.poss.config.repository.ExchangeConfigDetailsRepository;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
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
public class ExchangeConfigDetailsSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	ExchangeConfigDetailsRepository exchangeConfigDetailsRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeConfigDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.EXCHANGE_CONFIG_DETAILS_ADD)) {
				List<ExchangeConfigDetailsDao> sourceGepConfigDetails = getSourceList(data.getData());
				compareListsAndSave(sourceGepConfigDetails, messageId, data.getOrder(),messageTransfer.getMessageTransferData().getDestination());
			}
		});

	}

	/**
	 * @param sourceGepConfigDetails
	 * @param messageId
	 * @param dest 
	 */
	private void compareListsAndSave(List<ExchangeConfigDetailsDao> sourceGepConfigDetails,
			String messageId, int order, String dest) {
		List<ExchangeConfigDetailsDao> newGepConfigDetailsList = new ArrayList<>();
		List<ExchangeConfigDetailsDao> delConfigDetailsList = new ArrayList<>();
		for (ExchangeConfigDetailsDao srcGepDetails : sourceGepConfigDetails) {
			ExchangeConfigDetailsDao destination = exchangeConfigDetailsRepository.findExchangeConfigDetails(
					srcGepDetails.getRange().getId(), srcGepDetails.getMetalType(), srcGepDetails.getItemType(),
					srcGepDetails.getExchangeConfig().getConfigId());
			if (destination != null) {
				if (srcGepDetails.getSyncTime() >= destination.getSyncTime()) {
					if (order == 0) {
						delConfigDetailsList.add(destination);
					} else if (order == 1) {
						delConfigDetailsList.add(destination);
						newGepConfigDetailsList.add(srcGepDetails);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				newGepConfigDetailsList.add(srcGepDetails);
			}
		}
		saveAllToDestinationDB(newGepConfigDetailsList, order, delConfigDetailsList);
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,dest);
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param newGepConfigDetailsList
	 * @param delConfigDetailsList
	 */
	private void saveAllToDestinationDB(List<ExchangeConfigDetailsDao> newGepConfigDetailsList, int order,
			List<ExchangeConfigDetailsDao> delConfigDetailsList) {
		try {
			if (order == 0)
				exchangeConfigDetailsRepository.deleteAll(delConfigDetailsList);
			else if (order == 1) {
				if (!delConfigDetailsList.isEmpty()) {
					exchangeConfigDetailsRepository.deleteAll(delConfigDetailsList);
					exchangeConfigDetailsRepository.flush();
				}
				exchangeConfigDetailsRepository.saveAll(newGepConfigDetailsList);
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
	 * @param data
	 * @return List<ExchangeConfigDetailsDao>
	 */
	private List<ExchangeConfigDetailsDao> getSourceList(Object data) {
		ExchangeConfigDetailsSyncDto syncDto = new ExchangeConfigDetailsSyncDto();
		return syncDto.getGepConfigDetailsDaoList(MapperUtil.getObjectMapperInstance().convertValue(data,
				new TypeReference<List<ExchangeConfigDetailsSyncDto>>() {
				}));
	}

}
