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
import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDao;
import com.titan.poss.config.dto.ExchangeConfigExcludeMappingSyncDto;
import com.titan.poss.config.repository.ExchangeConfigExcludeMappingRepository;
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
public class ExchangeConfigExcludeMappingSyncService implements SyncOperation {

	@Autowired
	ExchangeConfigExcludeMappingRepository exchangeConfigExcludeMappingRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeConfigExcludeMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.EXCHANGE_CONFIG_THEME_ADD)
					|| operationCode.equals(ConfigServiceOperationCodes.EXCHANGE_CONFIG_ITEMS_ADD)) {
				List<ExchangeConfigExcludeMappingDao> sourceGepConfigList = getSourceList(data.getData());
				List<ExchangeConfigExcludeMappingDao> destGepConfigList = getDestinationList(sourceGepConfigList);
				compareListsAndSave(sourceGepConfigList, destGepConfigList, messageId, data.getOrder(),messageTransfer.getMessageTransferData().getDestination());
			}
		});
	}

	/**
	 * @param sourceGepConfigList
	 * @param destGepConfigList
	 * @param messageId
	 * @param dest 
	 */
	private void compareListsAndSave(List<ExchangeConfigExcludeMappingDao> sourceGepConfigList,
			List<ExchangeConfigExcludeMappingDao> destGepConfigList, String messageId, int order, String dest) {
		List<ExchangeConfigExcludeMappingDao> newGepConfigList = new ArrayList<>();
		List<ExchangeConfigExcludeMappingDao> deleteConfigList = new ArrayList<>();
		for (ExchangeConfigExcludeMappingDao sourceGepConfig : sourceGepConfigList) {
			if(order ==0) {
				ExchangeConfigExcludeMappingDao config = exchangeConfigExcludeMappingRepository.getOneByExchangeConfigConfigIdAndItemCode(sourceGepConfig.getExchangeConfig().getConfigId(),sourceGepConfig.getItemCode());
				if(config != null)
					deleteConfigList.add(config);
			}
			boolean isNew = true;
			for (ExchangeConfigExcludeMappingDao destination : destGepConfigList) {
				if (sourceGepConfig.getId().equals(destination.getId())) {
					isNew = false;
					if (sourceGepConfig.getSyncTime() >= destination.getSyncTime()) {
						newGepConfigList.add(sourceGepConfig);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				newGepConfigList.add(sourceGepConfig);
			}
		}
		saveAllToDestinationDB(newGepConfigList,deleteConfigList, order);
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,dest);
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param newGepConfigList
	 * @param deleteConfigList 
	 */
	private void saveAllToDestinationDB(List<ExchangeConfigExcludeMappingDao> newGepConfigList, List<ExchangeConfigExcludeMappingDao> deleteConfigList, int order) {
		try {
			if (order == 0) {
				if(!deleteConfigList.isEmpty()) {
					exchangeConfigExcludeMappingRepository.deleteAll(deleteConfigList);
					exchangeConfigExcludeMappingRepository.flush();
				}
				exchangeConfigExcludeMappingRepository.saveAll(newGepConfigList);
			}
			else if (order == 1)
				exchangeConfigExcludeMappingRepository.deleteAll(newGepConfigList);
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
	 * @param sourceGiftList
	 * @return List<GepConfigExcludeMappingDao>
	 */
	private List<ExchangeConfigExcludeMappingDao> getDestinationList(
			List<ExchangeConfigExcludeMappingDao> sourceGepConfigList) {
		List<String> ids = new ArrayList<>();
		sourceGepConfigList.forEach(src -> ids.add(src.getId()));
		return exchangeConfigExcludeMappingRepository.findAllById(ids);
	}

	/**
	 * @param data
	 * @return List<GepConfigExcludeMappingDao>
	 */
	private List<ExchangeConfigExcludeMappingDao> getSourceList(Object data) {
		ExchangeConfigExcludeMappingSyncDto syncDto = new ExchangeConfigExcludeMappingSyncDto();
		return syncDto.getDaoList(MapperUtil.getObjectMapperInstance().convertValue(data,
				new TypeReference<List<ExchangeConfigExcludeMappingSyncDto>>() {
				}));
	}

}
