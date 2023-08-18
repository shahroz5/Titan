/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.products.service;

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
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.ProductPriceMappingDao;
import com.titan.poss.product.repository.ProductPriceMappingRepository;
import com.titan.poss.product.sync.dto.ProductPriceMappingSyncDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ProductPriceMappingSyncService implements SyncOperation {

	@Autowired
	ProductPriceMappingRepository productPriceMappingRepo;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(ProductPriceMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			ProductPriceMappingSyncDto productPriceMappingSyncDto = new ProductPriceMappingSyncDto();
			List<ProductPriceMappingDao> productPriceList = productPriceMappingSyncDto.getDaoList(
							mapper.convertValue(data.getData(), new TypeReference<List<ProductPriceMappingSyncDto>>() {
					}));
			saveToDestinationDB(productPriceList, messageId, messageTransfer.getMessageTransferData().getDestination());
		});
	
	}


@Transactional
public void saveToDestinationDB(List<ProductPriceMappingDao> sourceList, String messageId,String dest) {

	try {
			String correlationId = sourceList.get(0).getCorrelationId();
			List<ProductPriceMappingDao> productPrice = productPriceMappingRepo.findAllByCorrelationId(correlationId);
			if (productPrice.isEmpty()) {
				productPriceMappingRepo.deleteAll();
				productPriceMappingRepo.flush();
			}

			productPriceMappingRepo.saveAll(sourceList);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, DatasyncStatusEnum.SYNCED.name());
	} catch (DataIntegrityViolationException ex) {
		LOGGER.error(EXCEPTION, ex);
		datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
				DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
	} catch (Exception ex) {
		LOGGER.error(EXCEPTION, ex);
		datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
				DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
	}
}
}
