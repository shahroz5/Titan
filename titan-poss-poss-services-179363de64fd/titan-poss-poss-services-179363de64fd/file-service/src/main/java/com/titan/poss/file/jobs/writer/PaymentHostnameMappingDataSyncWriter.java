/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.file.service.impl.DataSyncServiceImpl;
import com.titan.poss.payment.dao.PaymentHostnameMappingDaoExt;
import com.titan.poss.payment.dto.PaymentHostnameMappingSyncDtoExt;
import com.titan.poss.product.dao.SyncStaging;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PaymentHostnameMappingDataSyncWriter implements ItemWriter<PaymentHostnameMappingDaoExt> {

	@Autowired
	private DataSyncServiceImpl syncDataService;
	
	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends PaymentHostnameMappingDaoExt> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<PaymentHostnameMappingDaoExt>) items);
		syncDataService.publishProductMessagesToQueue(data, "payments.dbo.sync_staging");
	}

	private SyncStagingDto getStagingDto(List<PaymentHostnameMappingDaoExt> paymentHostnameMappingDaoList) {
		List<SyncData> paymentHostnameMappingSyncData = getSyncDataList(paymentHostnameMappingDaoList);
		List<String> destinations = new ArrayList<>();
		MessageRequest paymentHostnameMappingMsgeRequest = DataSyncUtil.createMessageRequest(
				paymentHostnameMappingSyncData, PaymentOperationCodes.PAYMENT_HOSTNAME_MAPPING_ADD,
				destinations, MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(paymentHostnameMappingMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(paymentHostnameMappingMsgeRequest);
		SyncStaging paymentHostnameMappingStaggingMsg = new SyncStaging();
		paymentHostnameMappingStaggingMsg.setMessage(requestBody);
		paymentHostnameMappingStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(paymentHostnameMappingStaggingMsg, "payments.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	
	private List<SyncData> getSyncDataList(List<PaymentHostnameMappingDaoExt> paymentHostnameMappingDaoList) {
		List<SyncData> paymentHostnameMappingSyncDataList = new ArrayList<>();
		PaymentHostnameMappingSyncDtoExt syncDto = new PaymentHostnameMappingSyncDtoExt();
		paymentHostnameMappingSyncDataList
				.add((DataSyncUtil.createSyncData(syncDto.getSyncDtoList(paymentHostnameMappingDaoList), 0)));
		
		return paymentHostnameMappingSyncDataList;
	}

}
