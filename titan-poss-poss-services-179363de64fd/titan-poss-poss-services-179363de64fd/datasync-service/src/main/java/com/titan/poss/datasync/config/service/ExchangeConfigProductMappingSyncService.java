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
import com.titan.poss.config.dao.ExchangeConfigProductMappingDao;
import com.titan.poss.config.dto.ExchangeConfigProductSyncDto;
import com.titan.poss.config.repository.ExchangeConfigProductMappingRepository;
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
public class ExchangeConfigProductMappingSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	ExchangeConfigProductMappingRepository exchangeConfigProductRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeConfigProductMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.EXCHANGE_CONFIG_PRODUCT_ADD)) {
				List<ExchangeConfigProductMappingDao> sourceExchangeConfigProduts = getSourceList(data.getData());
				compareListsAndSave(sourceExchangeConfigProduts, messageId, data.getOrder(),messageTransfer.getMessageTransferData().getDestination());
			}
		});
	}

	/**
	 * @param sourceGepConfigProduts
	 * @param destGepConfigProducts
	 * @param messageId
	 * @param order
	 * @param dest 
	 */
	private void compareListsAndSave(List<ExchangeConfigProductMappingDao> sourceExchangeConfigProduts,
			String messageId, int order, String dest) {
		List<ExchangeConfigProductMappingDao> delConfigPrdList = new ArrayList<>();
		List<ExchangeConfigProductMappingDao> newGepConfigProductsList = new ArrayList<>();

		for (ExchangeConfigProductMappingDao srcGepProducts : sourceExchangeConfigProduts) {
			ExchangeConfigProductMappingDao destination = getDestinationMapping(srcGepProducts);
			if (destination != null) {
				if (srcGepProducts.getSyncTime() >= destination.getSyncTime()) {
					if (order == 1) {
						delConfigPrdList.add(destination);
					} else if (order == 0) {
						delConfigPrdList.add(destination);
						newGepConfigProductsList.add(srcGepProducts);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				newGepConfigProductsList.add(srcGepProducts);
			}
		}
		saveAllToDestinationDB(newGepConfigProductsList, order, delConfigPrdList);
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,dest);
		DataSyncAuditDtoThreadLocal.unsetSyncData();

	}

	/**
	 * @param srcGepProducts
	 * @return ExchangeConfigProductMappingDao
	 */
	private ExchangeConfigProductMappingDao getDestinationMapping(ExchangeConfigProductMappingDao srcGepProducts) {
		String productGroupCode = null;
		String productCategoryCode = null;
		String rangeId = null;
		if (srcGepProducts.getRange() != null)
			rangeId = srcGepProducts.getRange().getId();
		if (srcGepProducts.getProductCategoryCode() != null)
			productCategoryCode = srcGepProducts.getProductCategoryCode();
		if (srcGepProducts.getProductGroupCode() != null)
			productGroupCode = srcGepProducts.getProductGroupCode();
		return exchangeConfigProductRepository
				.findByExchangeConfigConfigIdAndRangeIdAndProductCategoryCodeAndProductGroupCode(
						srcGepProducts.getExchangeConfig().getConfigId(), rangeId, productCategoryCode,
						productGroupCode);
	}

	/**
	 * @param newGepConfigProductsList
	 * @param order
	 * @param delConfigPrdList
	 */
	private void saveAllToDestinationDB(List<ExchangeConfigProductMappingDao> newExchangeConfigProductsList,
			int order, List<ExchangeConfigProductMappingDao> delConfigPrdList) {
		try {
			if (order == 1)
				exchangeConfigProductRepository.deleteAll(delConfigPrdList);
			else if (order == 0) {
				if (!delConfigPrdList.isEmpty()) {
					exchangeConfigProductRepository.deleteAll(delConfigPrdList);
					exchangeConfigProductRepository.flush();
				}
				exchangeConfigProductRepository.saveAll(newExchangeConfigProductsList);
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
	 * @return List<GepConfigProductMappingDao>
	 */
	private List<ExchangeConfigProductMappingDao> getSourceList(Object data) {
		ExchangeConfigProductSyncDto syncDto = new ExchangeConfigProductSyncDto();
		return syncDto.getDaoList(MapperUtil.getObjectMapperInstance().convertValue(data,
				new TypeReference<List<ExchangeConfigProductSyncDto>>() {
				}));
	}
}
