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
import com.titan.poss.payment.dao.PayerConfigDao;
import com.titan.poss.payment.dto.PayerConfigSyncDto;
import com.titan.poss.payment.repository.PayerBankConfigRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class PayerConfigSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PayerBankConfigRepository payerBankConfigRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PayerConfigSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {

			ObjectMapper mapper = new ObjectMapper();
			PayerConfigSyncDto payerConfigSyncDto = new PayerConfigSyncDto();
			PayerConfigDao srcPayerConfig = payerConfigSyncDto
					.getPayerConfigDao(mapper.convertValue(data.getData(), new TypeReference<PayerConfigSyncDto>() {
					}));
			PayerConfigDao destPayerConfig = payerBankConfigRepository.findOneById(srcPayerConfig.getId());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(PaymentOperationCodes.PAYER_BANK_CONFIG_ADD)
					|| operationCode.equals(PaymentOperationCodes.PAYER_BANK_CONFIG_UPDATE)) {

				if (destPayerConfig == null) {
					saveToDestinationDB(srcPayerConfig, messageId,messageTransfer.getMessageTransferData().getDestination());

				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(srcPayerConfig, destPayerConfig);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(srcPayerConfig, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}

		});
	}

	/**
	 * @param srcPayerConfig
	 * @param destPayerConfig
	 * @return DatasyncStatusEnum
	 */
	private DatasyncStatusEnum compareSyncIdVersions(PayerConfigDao srcPayerConfig, PayerConfigDao destPayerConfig) {
		return ReceiverUtil.isSyncable(srcPayerConfig.getSrcSyncId(), srcPayerConfig.getDestSyncId(),
				destPayerConfig.getSrcSyncId(), destPayerConfig.getDestSyncId());
	}

	/**
	 * @param srcPayerConfig
	 * @param messageId
	 * @param dest 
	 */
	private void saveToDestinationDB(PayerConfigDao srcPayerConfig, String messageId, String dest) {

		int tempSrcDataSyncId = srcPayerConfig.getSrcSyncId();
		srcPayerConfig.setSrcSyncId(srcPayerConfig.getDestSyncId());
		srcPayerConfig.setDestSyncId(tempSrcDataSyncId);
		try {
			payerBankConfigRepository.save(srcPayerConfig);
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
