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
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.PaymentLovDao;
import com.titan.poss.payment.dto.PaymentLovSyncDto;
import com.titan.poss.payment.repository.PaymentLovRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PaymentLovSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PaymentLovRepository lovRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentLovSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();

		for (SyncData syncData : syncDataList) {
			ObjectMapper mapper = new ObjectMapper();
			PaymentLovSyncDto paymentLovSyncDto = new PaymentLovSyncDto();
			List<PaymentLovDao> sourceLovList = paymentLovSyncDto.getPaymentLovDaoList(
					mapper.convertValue(syncData.getData(), new TypeReference<List<PaymentLovSyncDto>>() {
					}));
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(PaymentOperationCodes.PAYMENT_LOV_ADD)
					|| operationCode.equals(PaymentOperationCodes.PAYMENT_LOV_UPDATE)) {
				for (PaymentLovDao sourceLov : sourceLovList) {
					PaymentLovDao destinationLov = lovRepository.findOneByLovTypeAndCode(sourceLov.getLovType(),
							sourceLov.getCode());
					if (destinationLov == null) {
						saveToDestinationDB(sourceLov);

					} else {
						compareSyncIdVersions(sourceLov, destinationLov);
					}
				}

				List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
				datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
				DataSyncAuditDtoThreadLocal.unsetSyncData();

			}
		}
	}

	/**
	 * @param sourceLov
	 * @param destinationLov
	 */
	private void compareSyncIdVersions(PaymentLovDao src, PaymentLovDao dest) {
		DatasyncStatusEnum status = ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(),
				dest.getSrcSyncId(), dest.getDestSyncId());

		if (!status.equals(DatasyncStatusEnum.SYNCED)) {
			ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
		} else {
			saveToDestinationDB(src);
		}
	}

	/**
	 * @param sourceLov
	 */
	private void saveToDestinationDB(PaymentLovDao sourceLov) {
		int tempSrcDataSyncId = sourceLov.getSrcSyncId();
		sourceLov.setSrcSyncId(sourceLov.getDestSyncId());
		sourceLov.setDestSyncId(tempSrcDataSyncId);
		try {
			lovRepository.save(sourceLov);
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
