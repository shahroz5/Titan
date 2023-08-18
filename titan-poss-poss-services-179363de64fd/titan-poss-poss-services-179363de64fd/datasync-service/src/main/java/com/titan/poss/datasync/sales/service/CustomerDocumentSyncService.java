/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
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
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CustomerDocumentSyncService implements SyncOperation {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CustomerDocumentSyncService.class);
	private static final String EXCEPTION = "exception : ";
	

	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private SalesCommonUtil salesCommon;
	
	@Autowired
	private CustomerDocumentSyncService custDocumentSyncService;
	
	@Autowired
	private CustomerDocumentsRepository customerDocRepo;
	
	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
				Boolean flag=syncCustomerDocument(syncData);
				if (Boolean.TRUE.equals(flag)) {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
				} else {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
				}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private Boolean syncCustomerDocument(List<SyncData> syncData) {
		ObjectMapper mapper = new ObjectMapper();
		List<CustomerDocumentsDao> customerDocumentList=new ArrayList<>();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				 salesCommon.syncCustomerDocument(data,customerDocumentList, mapper);
			}
		}
		return custDocumentSyncService.dbOperation(customerDocumentList);
	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(List<CustomerDocumentsDao> customerDocumentList) {
		Boolean flag = false;
		if (!customerDocumentList.isEmpty()) {
			customerDocRepo.saveAll(customerDocumentList);
			flag = true;
		}
		return flag;
	}
}
