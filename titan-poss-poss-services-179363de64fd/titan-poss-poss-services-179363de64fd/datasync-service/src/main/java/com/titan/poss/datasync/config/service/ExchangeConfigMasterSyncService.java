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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.ExchangeConfigCustomerMappingDao;
import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.config.dto.ExchangeConfigCustomerSyncDto;
import com.titan.poss.config.dto.ExchangeConfigMasterSyncDto;
import com.titan.poss.config.repository.ExchangeConfigCustomerMappingRepository;
import com.titan.poss.config.repository.ExchangeConfigMasterRepository;
import com.titan.poss.core.dto.SyncData;
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
public class ExchangeConfigMasterSyncService implements SyncOperation {

	@Autowired
	ExchangeConfigMasterRepository exchangeConfigMasterRepository;

	@Autowired
	ExchangeConfigCustomerMappingRepository exchangeConfigCustomerMappingRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeConfigMasterSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.EXCHANGE_CONFIG_ADD)
					|| operationCode.equals(ConfigServiceOperationCodes.EXCHANGE_CONFIG_UPDATE)) {
				if(syncData.getOrder() == 0) {
					getConfigMasterAndSave(syncData, syncData.getOrder());
				} else if (syncData.getOrder() == 1) {
					getConfigCustomerMappingAndSave(syncData, syncData.getOrder());
				}
			}
		}
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param syncData
	 * @param order
	 */
	private void getConfigCustomerMappingAndSave(SyncData syncData, int order) {
		ObjectMapper mapper = new ObjectMapper();
		ExchangeConfigCustomerSyncDto configCustomerSyncDto = new ExchangeConfigCustomerSyncDto();
		List<ExchangeConfigCustomerMappingDao> srcConfgiCustomerList = configCustomerSyncDto.getDaoList(
				mapper.convertValue(syncData.getData(), new TypeReference<List<ExchangeConfigCustomerSyncDto>>() {
				}));
		List<String> ids = new ArrayList<>();
		srcConfgiCustomerList.forEach(src -> ids.add(src.getId()));
		List<ExchangeConfigCustomerMappingDao> detstConfigCustomerList = exchangeConfigCustomerMappingRepository
				.findAllById(ids);
		compareConfigCustomerLists(srcConfgiCustomerList, detstConfigCustomerList, order);
	}

	/**
	 * @param srcConfgiCustomerList
	 * @param detstConfigCustomerList
	 * @param order
	 */
	private void compareConfigCustomerLists(List<ExchangeConfigCustomerMappingDao> srcConfgiCustomerList,
			List<ExchangeConfigCustomerMappingDao> detstConfigCustomerList, int order) {

		List<ExchangeConfigCustomerMappingDao> eccmList = new ArrayList<>();
		for (ExchangeConfigCustomerMappingDao configCustomer : srcConfgiCustomerList) {
			boolean isNew = true;
			for (ExchangeConfigCustomerMappingDao destination : detstConfigCustomerList) {

				if (configCustomer.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(configCustomer.getSrcSyncId(),
							configCustomer.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (status.equals(DatasyncStatusEnum.SYNCED)) {
						int tempSrcDataSyncId = configCustomer.getSrcSyncId();
						configCustomer.setSrcSyncId(configCustomer.getDestSyncId());
						configCustomer.setDestSyncId(tempSrcDataSyncId);
						eccmList.add(configCustomer);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = configCustomer.getSrcSyncId();
				configCustomer.setSrcSyncId(configCustomer.getDestSyncId());
				configCustomer.setDestSyncId(tempSrcDataSyncId);
				eccmList.add(configCustomer);
			}

		}

		saveToDestinationDB(eccmList, order);
	}


	/**
	 * @param syncData
	 * @param order
	 * @param messageId
	 */
	private void getConfigMasterAndSave(SyncData syncData, int order) {
		ObjectMapper mapper = new ObjectMapper();
		ExchangeConfigMasterSyncDto exchangeConfigMasterSyncDto = new ExchangeConfigMasterSyncDto();
		ExchangeConfigMasterDao srcExchangeConfig = exchangeConfigMasterSyncDto.getGepConfigMasterDao(
				mapper.convertValue(syncData.getData(), new TypeReference<ExchangeConfigMasterSyncDto>() {
				}));
		ExchangeConfigMasterDao destExchangeConfigMaster = exchangeConfigMasterRepository
				.findOneByConfigId(srcExchangeConfig.getConfigId());
		if (destExchangeConfigMaster == null) {
			swapExchangeConfigMasterSyncIds(srcExchangeConfig);
			saveToDestinationDB(srcExchangeConfig, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcExchangeConfig.getSrcSyncId(),
					srcExchangeConfig.getDestSyncId(), destExchangeConfigMaster.getSrcSyncId(),
					destExchangeConfigMaster.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				swapExchangeConfigMasterSyncIds(srcExchangeConfig);
				saveToDestinationDB(srcExchangeConfig, order);
			}
		}

	}

	/**
	 * @param srcExchangeConfig
	 */
	private void swapExchangeConfigMasterSyncIds(ExchangeConfigMasterDao srcExchangeConfig) {
		int tempSrcDataSyncId = srcExchangeConfig.getSrcSyncId();
		srcExchangeConfig.setSrcSyncId(srcExchangeConfig.getDestSyncId());
		srcExchangeConfig.setDestSyncId(tempSrcDataSyncId);
	}

	/**
	 * @param srcGepConfig
	 * @param messageId
	 * @param order
	 */
	@SuppressWarnings("unchecked")
	private void saveToDestinationDB(Object data, int order) {
		try {
			if (order == 0)
				exchangeConfigMasterRepository.save((ExchangeConfigMasterDao)data);
			else if (order == 1)
				exchangeConfigCustomerMappingRepository.saveAll((List<ExchangeConfigCustomerMappingDao>) data);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

}
