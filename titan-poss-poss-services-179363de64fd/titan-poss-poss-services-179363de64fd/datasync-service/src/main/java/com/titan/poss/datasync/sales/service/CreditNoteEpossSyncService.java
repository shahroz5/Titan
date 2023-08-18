/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.sales.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dao.SyncStaging;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.repository.DataSyncRepository;
import com.titan.poss.datasync.service.DataSyncDataService;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.EpossCallServiceImpl;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dto.CreditNoteSyncDto;
import com.titan.poss.sales.repository.CreditNoteRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class CreditNoteEpossSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private CreditNoteRepository creditRepository;

	@Value("${app.name}")
	private String appName;

	@Autowired
	private DataSyncDataService dataSyncDataService;

	@Autowired
	private EpossCallServiceImpl serviceCall;

	@Autowired
	private DataSyncRepository dataSyncRepo;

	private static final Logger LOGGER = LoggerFactory.getLogger(CreditNoteEpossSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationcode = messageTransfer.getMessageTransferData().getOperation();
		try {
			Boolean flag = syncConfirmData(syncData, operationcode);
			if (Boolean.TRUE.equals(flag)) {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,
						messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
			} else {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,
						messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
			}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.FAILED_PERSIST.name(),
					ex.getMessage());
		}
	}

	private Boolean syncConfirmData(List<SyncData> syncData, String operationcode) {
		List<CreditNoteDao> creditNoteList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0)
				syncCreditNote(data, creditNoteList, mapper);
		}
		if (!creditNoteList.isEmpty()) {
			List<CreditNoteDao> cnList = saveCreditNotes(creditNoteList, operationcode);
			if (!CollectionUtils.isEmpty(cnList) && !operationcode.equals(SalesOperationCode.CREDIT_NOTE_EPOSS_SRC))
				syncBackToEposs(cnList);
		}
		return true;
	}

	private void syncBackToEposs(List<CreditNoteDao> cnListToPublish) {
		cnListToPublish.forEach(cnPublish -> {
			cnPublish.setPublishStatus(null);
			cnPublish.setSrcSyncId(cnPublish.getSrcSyncId() + 1);
		});
		cnListToPublish = creditRepository.saveAll(cnListToPublish);
		SyncStagingDto syncData = syncStaggingCreditNote(cnListToPublish, SalesOperationCode.CREDIT_NOTE_REVERSE);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			String token = "Bearer " + serviceCall.getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());
			dataSyncDataService.publishDataSyncDataToQueue(token, syncData);
		}

	}

	private List<CreditNoteDao> saveCreditNotes(List<CreditNoteDao> creditNoteList, String operationcode) {
		List<CreditNoteDao> cnSaved = new ArrayList<>();
		if (operationcode.equals(SalesOperationCode.CREDIT_NOTE_EPOSS_DEST)) {
			creditNoteList.forEach(cn -> {
				cn = cnSave(cn);
				cnSaved.add(cn);
			});
		} else {
			creditNoteList.forEach(cn -> {
				cn = cnSave(cn);
				cnSaved.add(cn);
			});
		}
		return cnSaved;
	}

	private CreditNoteDao cnSave(CreditNoteDao cn) {
		String parent = null;
		String oiginal = null;
		if (cn.getParentCn() != null) {
			parent = cn.getParentCn().getId();
			cn.setParentCn(null);
		}
		if (cn.getOriginalCn() != null) {
			oiginal = cn.getOriginalCn().getId();
			cn.setOriginalCn(null);
		}
		cn = creditRepository.saveAndFlush(cn);
		if (parent != null) {
			CreditNoteDao cnParent = new CreditNoteDao();
			cnParent.setId(parent);
			cn.setParentCn(cnParent);
		}
		if (oiginal != null) {
			CreditNoteDao cnOiginal = new CreditNoteDao();
			cnOiginal.setId(oiginal);
			cn.setOriginalCn(cnOiginal);
		}
		return creditRepository.save(cn);
	}

	private void syncCreditNote(SyncData data, List<CreditNoteDao> creditNoteList, ObjectMapper mapper) {
		CreditNoteSyncDto syncDto = new CreditNoteSyncDto();
		List<CreditNoteDao> srcCreditList = syncDto
				.getCreditNoteDaoList(mapper.convertValue(data.getData(), new TypeReference<List<CreditNoteSyncDto>>() {
				}));
		srcCreditList.forEach(srcCredit -> {
			Optional<CreditNoteDao> destCredit = creditRepository.findById(srcCredit.getId());
			if (!destCredit.isPresent()) {
				int tempSrcDataSyncId = srcCredit.getSrcSyncId();
				srcCredit.setSrcSyncId(srcCredit.getDestSyncId());
				srcCredit.setDestSyncId(tempSrcDataSyncId);
				creditNoteList.add(srcCredit);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCredit.getSrcSyncId(), srcCredit.getDestSyncId(),
						destCredit.get().getSrcSyncId(), destCredit.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcCredit.getSrcSyncId();
					srcCredit.setSrcSyncId(srcCredit.getDestSyncId());
					srcCredit.setDestSyncId(tempSrcDataSyncId);
					creditNoteList.add(srcCredit);
				}
			}
		});
	}

	private SyncStagingDto syncStaggingCreditNote(List<CreditNoteDao> creditNoteList, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		List<CreditNoteSyncDto> dtoList = new ArrayList<>();
		creditNoteList.forEach(dao -> dtoList.add(new CreditNoteSyncDto(dao)));
		destinations.add(AppTypeEnum.EPOSS.name());
		syncDataList.add(DataSyncUtil.createSyncData(dtoList, 0));
		MessageRequest cnMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto cnStagingDto = new SyncStagingDto();
		cnStagingDto.setMessageRequest(cnMsgRequest);
		String cnMsgRqst = MapperUtil.getJsonString(cnMsgRequest);
		SyncStaging cnSyncStaging = new SyncStaging();
		cnSyncStaging.setMessage(cnMsgRqst);
		cnSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		cnSyncStaging = dataSyncRepo.save(cnSyncStaging);
		cnStagingDto.setId(cnSyncStaging.getId());
		return cnStagingDto;
	}

}
