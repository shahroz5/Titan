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
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.PriceGroupDao;
import com.titan.poss.product.repository.PriceGroupRepository;
import com.titan.poss.product.sync.dto.PriceGroupSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PriceGroupSyncService implements SyncOperation {

	@Autowired
	private PriceGroupRepository priceGroupRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(PriceGroupSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			PriceGroupSyncDto priceGroupSyncDto = new PriceGroupSyncDto();
			PriceGroupDao sourcePriceGroup = priceGroupSyncDto
					.getPriceGroupDao(mapper.convertValue(data.getData(), new TypeReference<PriceGroupSyncDto>() {
					}));
			PriceGroupDao destinationPriceGroup = priceGroupRepository
					.findOneByPriceGroup(sourcePriceGroup.getPriceGroup());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ProductOperationCodes.PRICE_GROUP_ADD)
					|| operationCode.equals(ProductOperationCodes.PRICE_GROUP_UPDATE)) {

				if (destinationPriceGroup == null) {
					saveToDestinationDB(sourcePriceGroup, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourcePriceGroup, destinationPriceGroup);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourcePriceGroup, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}
		});
	}

	@Transactional
	public void saveToDestinationDB(PriceGroupDao sourcePriceGroup, String messageId, String dest) {

		int tempSrcDataSyncId = sourcePriceGroup.getSrcSyncId();
		sourcePriceGroup.setSrcSyncId(sourcePriceGroup.getDestSyncId());
		sourcePriceGroup.setDestSyncId(tempSrcDataSyncId);
		try {
			priceGroupRepository.save(sourcePriceGroup);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
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

	private DatasyncStatusEnum compareSyncIdVersions(PriceGroupDao src, PriceGroupDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}


}
