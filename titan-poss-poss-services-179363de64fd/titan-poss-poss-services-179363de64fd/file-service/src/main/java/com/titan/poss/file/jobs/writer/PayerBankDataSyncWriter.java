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
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.file.service.impl.DataSyncServiceImpl;
import com.titan.poss.payment.dao.PayerBankDao;
import com.titan.poss.payment.dto.PayerBankSyncDto;
import com.titan.poss.product.dao.SyncStaging;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PayerBankDataSyncWriter implements ItemWriter<PayerBankDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;
	
	
	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends PayerBankDao> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<PayerBankDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "payments.dbo.sync_staging");
		SyncStagingDto eghsData = getEGHSStagingDto((List<PayerBankDao>) items);
		syncDataService.publishProductMessagesToQueue(eghsData, "payments.dbo.sync_staging");
	}
	
	private SyncStagingDto getStagingDto(List<PayerBankDao> payerBankDaoList) {
		List<SyncData> payerBankSyncData = getSyncDataList(payerBankDaoList);
		List<String> destinations = new ArrayList<>();
		MessageRequest payerBankMsgeRequest = DataSyncUtil.createMessageRequest(payerBankSyncData, ProductOperationCodes.PAYER_BANK_ADD,
				destinations, MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(payerBankMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(payerBankMsgeRequest);
		SyncStaging payerBankStaggingMsg = new SyncStaging();
		payerBankStaggingMsg.setMessage(requestBody);
		payerBankStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(payerBankStaggingMsg, "payments.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private SyncStagingDto getEGHSStagingDto(List<PayerBankDao> payerBankDaoList) {
		List<SyncData> payerBankSyncData = getSyncDataList(payerBankDaoList);
		List<String> destinations = new ArrayList<>();
		destinations.add("EGHS");
		MessageRequest payerBankMsgeRequest = DataSyncUtil.createMessageRequest(payerBankSyncData,
				ProductOperationCodes.PAYER_BANK_ADD, destinations, MessageType.FIFO.toString(),
				DestinationType.SELECTIVE.toString());
		String requestBody = MapperUtil.getJsonString(payerBankMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(payerBankMsgeRequest);
		SyncStaging payerBankStaggingMsg = new SyncStaging();
		payerBankStaggingMsg.setMessage(requestBody);
		payerBankStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(payerBankStaggingMsg, "payments.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<PayerBankDao> payerBankDaoList) {
		List<SyncData> payerBankSyncDataList = new ArrayList<>();
		payerBankDaoList.stream().forEach(payerBank -> {
			List<PayerBankSyncDto> synDtoList=new ArrayList<>();
			PayerBankSyncDto payerBankSyncDto = new PayerBankSyncDto(payerBank);
			synDtoList.add(payerBankSyncDto);
			payerBankSyncDataList.add(DataSyncUtil.createSyncData(synDtoList, 0));
		});
		return payerBankSyncDataList;
	}

}
