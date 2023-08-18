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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
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
public class CreditNoteSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private CreditNoteRepository creditRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(CreditNoteSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag = syncConfirmData(syncData);
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

	private Boolean syncConfirmData(List<SyncData> syncData) {
		List<CreditNoteDao> creditNoteList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0)
				syncCreditNote(data, creditNoteList, mapper);
		}
		saveCreditNotes(creditNoteList);
		return true;
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

	private void saveCreditNotes(List<CreditNoteDao> creditNoteList) {

		creditNoteList.forEach(cn -> {
			cn.setPublishStatus(null);
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
			cn = creditRepository.save(cn);
		});
	}

}
