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
import com.titan.poss.config.dao.ExchangeConfigStoneMappingDao;
import com.titan.poss.config.dto.ExchangeConfigStoneSyncDto;
import com.titan.poss.config.repository.ExchangeConfigStoneMappingRepository;
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
public class ExchangeConfigStoneSyncService implements SyncOperation {

	@Autowired
	private ExchangeConfigStoneMappingRepository exchangeConfigStoneRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeConfigStoneSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.EXCHANGE_CONFIG_STONE_MAPPING)) {
				List<ExchangeConfigStoneMappingDao> srcExchangeStoneList = getSourceList(data.getData());
				compareListsAndSave(srcExchangeStoneList, messageId, data.getOrder(),messageTransfer.getMessageTransferData().getDestination());
			}
		});
	}

	/**
	 * @param srcExchangeStoneList
	 * @param messageId
	 * @param order
	 * @param dest 
	 */
	private void compareListsAndSave(List<ExchangeConfigStoneMappingDao> srcExchangeStoneList, String messageId,
			int order, String dest) {
		List<ExchangeConfigStoneMappingDao> newExchangeStoneList = new ArrayList<>();
		List<ExchangeConfigStoneMappingDao> delExchangeStoneList = new ArrayList<>();
		for (ExchangeConfigStoneMappingDao srcExchangeStone : srcExchangeStoneList) {
			ExchangeConfigStoneMappingDao destination = exchangeConfigStoneRepository.findExchangeConfigStone(
					srcExchangeStone.getRange().getId(), srcExchangeStone.getStoneTypeCode(),
					srcExchangeStone.getExchangeConfig().getConfigId(), srcExchangeStone.getStoneQuality());
			if (destination != null) {
				if (srcExchangeStone.getSyncTime() >= destination.getSyncTime()) {
					if (order == 0) {
						delExchangeStoneList.add(destination);
					} else if (order == 1) {
						delExchangeStoneList.add(destination);
						newExchangeStoneList.add(srcExchangeStone);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				newExchangeStoneList.add(srcExchangeStone);
			}
		}
		saveAllToDestinationDB(newExchangeStoneList, order, delExchangeStoneList);
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,dest);
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param newExchangeStoneList
	 * @param order
	 * @param delExchangeStoneList
	 */
	private void saveAllToDestinationDB(List<ExchangeConfigStoneMappingDao> newExchangeStoneList, int order,
			List<ExchangeConfigStoneMappingDao> delExchangeStoneList) {
		try {
			if (order == 0)
				exchangeConfigStoneRepository.deleteAll(delExchangeStoneList);
			else if (order == 1) {
				if (!delExchangeStoneList.isEmpty()) {
					exchangeConfigStoneRepository.deleteAll(delExchangeStoneList);
					exchangeConfigStoneRepository.flush();
				}
				exchangeConfigStoneRepository.saveAll(newExchangeStoneList);
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
	 * @return List<ExchangeConfigStoneMappingDao>
	 */
	private List<ExchangeConfigStoneMappingDao> getSourceList(Object data) {
		ExchangeConfigStoneSyncDto syncDto = new ExchangeConfigStoneSyncDto();
		return syncDto.getDaoList(MapperUtil.getObjectMapperInstance().convertValue(data,
				new TypeReference<List<ExchangeConfigStoneSyncDto>>() {
				}));
	}

}
