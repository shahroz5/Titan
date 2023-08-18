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
import com.titan.poss.payment.dao.PayeeBankDao;
import com.titan.poss.payment.dto.PayeeBankSyncDto;
import com.titan.poss.payment.repository.PayeeBankRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PayeeBankSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PayeeBankRepository payeeBankRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PayeeBankSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {

			ObjectMapper mapper = new ObjectMapper();
			PayeeBankSyncDto payeeBankSyncDto = new PayeeBankSyncDto();
			PayeeBankDao srcPayeeBank = payeeBankSyncDto
					.getPayeeBankDao(mapper.convertValue(data.getData(), new TypeReference<PayeeBankSyncDto>() {
					}));
			PayeeBankDao destPayeeBank = payeeBankRepository.findOneByBankName(srcPayeeBank.getBankName());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(PaymentOperationCodes.PAYEE_BANK_ADD)
					|| operationCode.equals(PaymentOperationCodes.PAYEE_BANK_UPDATE)) {

				if (destPayeeBank == null) {
					saveToDestinationDB(srcPayeeBank);

				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(srcPayeeBank, destPayeeBank);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						saveToDestinationDB(srcPayeeBank);
					}
				}

			}

		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param srcPayeeBank
	 * @param destPayeeBank
	 * @return DatasyncStatusEnum
	 */
	private DatasyncStatusEnum compareSyncIdVersions(PayeeBankDao srcPayeeBank, PayeeBankDao destPayeeBank) {
		return ReceiverUtil.isSyncable(srcPayeeBank.getSrcSyncId(), srcPayeeBank.getDestSyncId(),
				destPayeeBank.getSrcSyncId(), destPayeeBank.getDestSyncId());
	}

	/**
	 * @param srcPayeeBank
	 * @param messageId
	 */
	private void saveToDestinationDB(PayeeBankDao srcPayeeBank) {

		int tempSrcDataSyncId = srcPayeeBank.getSrcSyncId();
		srcPayeeBank.setSrcSyncId(srcPayeeBank.getDestSyncId());
		srcPayeeBank.setDestSyncId(tempSrcDataSyncId);
		try {
			payeeBankRepository.save(srcPayeeBank);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), null);
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), null);
		}
	}

}
