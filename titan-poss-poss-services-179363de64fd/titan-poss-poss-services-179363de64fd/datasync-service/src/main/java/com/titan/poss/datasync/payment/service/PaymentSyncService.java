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
import com.titan.poss.payment.dao.PaymentDao;
import com.titan.poss.payment.dto.PaymentSyncDto;
import com.titan.poss.payment.repository.PaymentRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PaymentSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PaymentRepository paymentRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();

		for (SyncData syncData : syncDataList) {
			ObjectMapper mapper = new ObjectMapper();
			PaymentSyncDto paymentSyncDto = new PaymentSyncDto();
			PaymentDao srcPayment = paymentSyncDto
					.getPaymentDao(mapper.convertValue(syncData.getData(), new TypeReference<PaymentSyncDto>() {
					}));
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			PaymentDao destPayment = paymentRepository.findOneByPaymentCode(srcPayment.getPaymentCode());
			if (operationCode.equals(PaymentOperationCodes.PAYMENT_ADD)
					|| operationCode.equals(PaymentOperationCodes.PAYMENT_UPDATE)) {
				if (destPayment == null) {
					saveToDestinationDB(srcPayment, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(srcPayment, destPayment);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());
					} else {
						saveToDestinationDB(srcPayment, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}
		}
	}

	/**
	 * @param srcPayment
	 * @param destPayment
	 * @return DatasyncStatusEnum
	 */
	private DatasyncStatusEnum compareSyncIdVersions(PaymentDao srcPayment, PaymentDao destPayment) {
		return ReceiverUtil.isSyncable(srcPayment.getSrcSyncId(), srcPayment.getDestSyncId(),
				destPayment.getSrcSyncId(), destPayment.getDestSyncId());
	}

	/**
	 * @param srcPayment
	 * @param messageId
	 * @param dest 
	 */
	private void saveToDestinationDB(PaymentDao srcPayment, String messageId, String dest) {
		int tempSrcDataSyncId = srcPayment.getSrcSyncId();
		srcPayment.setSrcSyncId(srcPayment.getDestSyncId());
		srcPayment.setDestSyncId(tempSrcDataSyncId);
		try {
			paymentRepository.save(srcPayment);
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
