/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.products.service;
import java.util.List;
import java.util.Optional;

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
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.PriceDao;
import com.titan.poss.product.repository.PriceRepository;
import com.titan.poss.product.sync.dto.PriceSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PriceSyncService implements SyncOperation {

	@Autowired
	private PriceRepository priceRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(PriceSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			ObjectMapper mapper = new ObjectMapper();
			PriceSyncDto priceSyncDto= new PriceSyncDto();
			PriceDao sourcePrice = priceSyncDto.getPriceDao(mapper.convertValue(data.getData(), new TypeReference<PriceSyncDto>() {}));
			Optional<PriceDao> destinationPrice = priceRepository.findByItemAndPriceGroup(sourcePrice.getItem(),sourcePrice.getPriceGroup());
			if (operationCode.equals(ProductOperationCodes.PRICE_ADD)
					|| operationCode.equals(ProductOperationCodes.PRICE_UPDATE)
					|| operationCode.equals(ProductOperationCodes.PRICE_BULK)) {
				if (destinationPrice.isEmpty()) {
					saveToDestinationDB(sourcePrice, messageId);
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourcePrice, destinationPrice.get());
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						saveToDestinationDB(sourcePrice, messageId);
					}
				}
			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	@Transactional
	public void saveToDestinationDB(PriceDao sourcePrice, String messageId) {

		int tempSrcDataSyncId = sourcePrice.getSrcSyncId();
		sourcePrice.setSrcSyncId(sourcePrice.getDestSyncId());
		sourcePrice.setDestSyncId(tempSrcDataSyncId);
		try {
			priceRepository.save(sourcePrice);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(PriceDao src, PriceDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}


}
