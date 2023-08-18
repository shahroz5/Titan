/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.payment.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.PaymentCategoryDao;
import com.titan.poss.payment.dto.PaymentCategorySyncDto;
import com.titan.poss.payment.repository.PaymentCategoryRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class PaymentCategorySyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PaymentCategoryRepository paymentCategoryRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentCategorySyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();

		for (SyncData syncData : syncDataList) {
			ObjectMapper mapper = new ObjectMapper();
			PaymentCategorySyncDto paymentCategorySyncDto = new PaymentCategorySyncDto();
			PaymentCategoryDao srcPaymentCategory = paymentCategorySyncDto.getPaymentCategoryDao(
					mapper.convertValue(syncData.getData(), new TypeReference<PaymentCategorySyncDto>() {
					}));
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			PaymentCategoryDao destPaymentCategory = paymentCategoryRepository
					.findOneByPaymentCategoryName(srcPaymentCategory.getPaymentCategoryName());
			if (operationCode.equals(PaymentOperationCodes.PAYMENT_CATEGORY_ADD)
					|| operationCode.equals(PaymentOperationCodes.PAYMENT_CATEGORY_UPDATE)) {
				if (destPaymentCategory == null) {
					saveToDestinationDB(srcPaymentCategory, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(srcPaymentCategory, destPaymentCategory);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());
					} else {
						saveToDestinationDB(srcPaymentCategory, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}
		}
	}

	/**
	 * @param srcPaymentCategory
	 * @param destPaymentCategory
	 * @return DatasyncStatusEnum
	 */
	private DatasyncStatusEnum compareSyncIdVersions(PaymentCategoryDao srcPaymentCategory,
			PaymentCategoryDao destPaymentCategory) {
		return ReceiverUtil.isSyncable(srcPaymentCategory.getSrcSyncId(), srcPaymentCategory.getDestSyncId(),
				destPaymentCategory.getSrcSyncId(), destPaymentCategory.getDestSyncId());
	}

	/**
	 * @param srcPaymentCategory
	 * @param messageId
	 * @param dest 
	 */
	private void saveToDestinationDB(PaymentCategoryDao srcPaymentCategory, String messageId, String dest) {
		int tempSrcDataSyncId = srcPaymentCategory.getSrcSyncId();
		srcPaymentCategory.setSrcSyncId(srcPaymentCategory.getDestSyncId());
		srcPaymentCategory.setDestSyncId(tempSrcDataSyncId);
		try {
			paymentCategoryRepository.save(srcPaymentCategory);
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


}
