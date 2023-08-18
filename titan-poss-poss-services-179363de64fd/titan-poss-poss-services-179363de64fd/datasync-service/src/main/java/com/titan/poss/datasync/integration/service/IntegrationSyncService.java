/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.integration.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.service.clients.InventoryServiceClient;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.IntegrationOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.EpossCallServiceImpl;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class IntegrationSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private InventoryServiceClient inventoryServiceclient;

	@Autowired
	EpossCallServiceImpl serviceCall;

	private static final Logger LOGGER = LoggerFactory.getLogger(IntegrationSyncService.class);
	private static final String EXCEPTION = "exception : ";
	private static final String BEARER = "Bearer ";
	private static final String FAILED = "FAILED";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			syncService(syncDataList, operationCode, messageId,
					messageTransfer.getMessageTransferData().getDestination());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(), FAILED, ex.getMessage());
		}

	}

	private void syncService(List<SyncData> syncDataList, String operationCode, String messageId, String dest) {
		String token = BEARER + serviceCall.getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());
		String location = null;
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				location = data.getData().toString();
			}
		}
		if (IntegrationOperationCodes.INVENTORY_JOB_IBT.equalsIgnoreCase(operationCode)) {
			inventoryServiceclient.closeUnacceptedRequests(token, null, location);
		}
		datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, DatasyncStatusEnum.SYNCED.name());
	}

}
