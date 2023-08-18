package com.titan.poss.datasync.payment.service;

import java.util.List;
import java.util.Optional;

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
import com.titan.poss.payment.dao.CreditNoteMasterDao;
import com.titan.poss.payment.dto.CreditNoteSyncDto;
import com.titan.poss.payment.repository.CreditNoteMasterRepository;

@Service
public class CreditNoteMasterSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private CreditNoteMasterSyncService creditNoteSyncService;

	@Autowired
	private CreditNoteMasterRepository creditNoteMasterRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(CreditNoteMasterSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		syncData.forEach(data -> {
			if (operationCode.equals(PaymentOperationCodes.CREDIT_NOTE_UPDATE)) {
				creditNoteSyncService.updateCreditNote(data);
				LOGGER.info("inside Update creditnote");
			}
//			else if (operationCode.equals(PaymentOperationCodes.CASHBACK_CARD_DETAILS_ADD)
//					|| operationCode.equals(PaymentOperationCodes.CASHBACK_CARD_DETAILS_UPDATE)) {
//				cashbackService.getCashbackCardDetails(data.getData(), messageId);
//			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,
				messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	private void updateCreditNote(SyncData data) {
		ObjectMapper mapper = new ObjectMapper();
		CreditNoteSyncDto creditNoteSyncDto = new CreditNoteSyncDto();
		CreditNoteMasterDao sourceCreditNote = creditNoteSyncDto
				.getCreditNoteMasterDao(mapper.convertValue(data.getData(), new TypeReference<CreditNoteSyncDto>() {
				}));
		LOGGER.info("SourceCreditNote : "+sourceCreditNote);
		Optional<CreditNoteMasterDao> destinationCreditNote = creditNoteMasterRepository
				.findById(sourceCreditNote.getCreditNoteType());
		destinationCreditNote.ifPresent(dest -> {
			LOGGER.info("is present "+destinationCreditNote);
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceCreditNote.getSrcSyncId(),
					sourceCreditNote.getDestSyncId(), destinationCreditNote.get().getSrcSyncId(),
					destinationCreditNote.get().getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				LOGGER.info("inside Update creditnote Status : "+status);
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				LOGGER.info("inside saveto destDb");
				saveToDestinationDB(sourceCreditNote);
			}
		});
		if (!destinationCreditNote.isPresent()) {
			saveToDestinationDB(sourceCreditNote);
		}

	}

	private void saveToDestinationDB(CreditNoteMasterDao sourceCreditNote) {
		int tempSrcDataSyncId = sourceCreditNote.getSrcSyncId();
		sourceCreditNote.setSrcSyncId(sourceCreditNote.getDestSyncId());
		sourceCreditNote.setDestSyncId(tempSrcDataSyncId);
		try {
			creditNoteMasterRepository.save(sourceCreditNote);
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
