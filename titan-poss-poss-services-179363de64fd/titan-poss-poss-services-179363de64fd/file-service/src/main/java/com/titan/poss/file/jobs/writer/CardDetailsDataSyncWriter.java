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
import com.titan.poss.payment.dao.CashbackCardDetailsDaoExt;
import com.titan.poss.payment.dto.CashbackCardDetailsSyncDtoExt;
import com.titan.poss.product.dao.SyncStaging;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class CardDetailsDataSyncWriter implements ItemWriter<CashbackCardDetailsDaoExt> {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends CashbackCardDetailsDaoExt> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<CashbackCardDetailsDaoExt>) items);
		syncDataService.publishProductMessagesToQueue(data, "payments.dbo.sync_staging");
	}

	private SyncStagingDto getStagingDto(List<CashbackCardDetailsDaoExt> cashbackCardDetailsDaoExt) {
		List<SyncData> cashbackCardSyncData = getSyncDataList(cashbackCardDetailsDaoExt);
		List<String> destinations = new ArrayList<>();
		MessageRequest cashBackCardMsgeRequest = DataSyncUtil.createMessageRequest(cashbackCardSyncData,
				PaymentOperationCodes.CASHBACK_CARD, destinations, MessageType.GENERAL.toString(),
				DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(cashBackCardMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(cashBackCardMsgeRequest);
		SyncStaging cashBackCardStaggingMsg = new SyncStaging();
		cashBackCardStaggingMsg.setMessage(requestBody);
		cashBackCardStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(cashBackCardStaggingMsg, "payments.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<CashbackCardDetailsDaoExt> cashbackCardDetailsDaoExt) {
		List<SyncData> cashbackCardDetailsDaoSyncDataList = new ArrayList<>();
		CashbackCardDetailsSyncDtoExt syncDto = new CashbackCardDetailsSyncDtoExt();
		cashbackCardDetailsDaoSyncDataList
				.add((DataSyncUtil.createSyncData(syncDto.getSyncDtoList(cashbackCardDetailsDaoExt), 0)));

		return cashbackCardDetailsDaoSyncDataList;
	}

}
