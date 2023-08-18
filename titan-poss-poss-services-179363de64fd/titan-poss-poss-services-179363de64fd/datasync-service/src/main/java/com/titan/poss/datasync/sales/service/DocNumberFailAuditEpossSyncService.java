package com.titan.poss.datasync.sales.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.repository.CustomerPaymentRepository;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DocNumberFailAuditEpossSyncService implements SyncOperation {
	
	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private SalesCommonUtil salesCommon;
	
	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditRepo;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(DocNumberFailAuditEpossSyncService.class);
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
	@Transactional
	private Boolean syncConfirmData(List<SyncData> syncData) {
		List<DocNumberFailAuditDaoExt> docNumberFailAudit = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				salesCommon.syncDocNumberFailAudit(data, docNumberFailAudit, mapper);
		     }
		}
		boolean flag=false;
		if (!docNumberFailAudit.isEmpty()) {
			docNumberFailAuditRepo.saveAll(docNumberFailAudit);
			flag = true;
		}
		return flag;
	}


}
