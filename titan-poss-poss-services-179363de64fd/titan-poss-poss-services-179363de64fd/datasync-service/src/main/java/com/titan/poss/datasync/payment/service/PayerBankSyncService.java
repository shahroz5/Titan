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
import com.titan.poss.payment.dao.PayerBankDao;
import com.titan.poss.payment.dto.PayerBankSyncDto;
import com.titan.poss.payment.repository.PayerBankRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PayerBankSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PayerBankRepository payerBankRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PayerBankSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();

		for (SyncData syncData : syncDataList) {
			ObjectMapper mapper = new ObjectMapper();
			PayerBankSyncDto payerBankSyncDto = new PayerBankSyncDto();
			List<PayerBankDao> srcPayerBankList = payerBankSyncDto.getPayerBankDaoList(
					mapper.convertValue(syncData.getData(), new TypeReference<List<PayerBankSyncDto>>() {
					}));
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(PaymentOperationCodes.PAYER_BANK_ADD)
					|| operationCode.equals(PaymentOperationCodes.PAYER_BANK_UPDATE)) {
				for (PayerBankDao srcPayerBank : srcPayerBankList) {
					PayerBankDao destPayerBank = payerBankRepository.findOneByBankName(srcPayerBank.getBankName());
					if (destPayerBank == null) {
						saveToDestinationDB(srcPayerBank);

					} else {
						compareSyncIdVersions(srcPayerBank, destPayerBank);
					}
				}

				List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
				datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
				DataSyncAuditDtoThreadLocal.unsetSyncData();

			}
		}
	}

	/**
	 * @param srcPayerBank
	 * @param destPayerBank
	 */
	private void compareSyncIdVersions(PayerBankDao srcPayerBank, PayerBankDao destPayerBank) {
		DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPayerBank.getSrcSyncId(), srcPayerBank.getDestSyncId(),
				destPayerBank.getSrcSyncId(), destPayerBank.getDestSyncId());

		if (!status.equals(DatasyncStatusEnum.SYNCED)) {
			ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
		} else {
			saveToDestinationDB(srcPayerBank);
		}
	}

	/**
	 * @param srcPayerBank
	 */
	private void saveToDestinationDB(PayerBankDao srcPayerBank) {
		int tempSrcDataSyncId = srcPayerBank.getSrcSyncId();
		srcPayerBank.setSrcSyncId(srcPayerBank.getDestSyncId());
		srcPayerBank.setDestSyncId(tempSrcDataSyncId);
		try {
			payerBankRepository.save(srcPayerBank);
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
