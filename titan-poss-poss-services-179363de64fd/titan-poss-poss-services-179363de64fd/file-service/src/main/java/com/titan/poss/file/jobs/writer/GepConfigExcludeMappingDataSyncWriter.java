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

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDaoExt;
import com.titan.poss.config.dto.ExchangeConfigExcludeMappingSyncDtoExt;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.file.service.impl.DataSyncServiceImpl;
import com.titan.poss.product.dao.SyncStaging;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class GepConfigExcludeMappingDataSyncWriter implements ItemWriter<ExchangeConfigExcludeMappingDaoExt> {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends ExchangeConfigExcludeMappingDaoExt> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<ExchangeConfigExcludeMappingDaoExt>) items);
		syncDataService.publishProductMessagesToQueue(data, "configs.dbo.sync_staging");
	}

	private SyncStagingDto getStagingDto(List<ExchangeConfigExcludeMappingDaoExt> gepConfigExcludeMappingDaoList) {
		List<SyncData> gepConfigSyncData = getSyncDataList(gepConfigExcludeMappingDaoList);
		List<String> destinations = new ArrayList<>();
		MessageRequest gepConfigMsgeRequest = DataSyncUtil.createMessageRequest(gepConfigSyncData,
				ConfigServiceOperationCodes.EXCHANGE_CONFIG_ITEMS_ADD, destinations, MessageType.GENERAL.toString(),
				DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(gepConfigMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(gepConfigMsgeRequest);
		SyncStaging gepConfigStaggingMsg = new SyncStaging();
		gepConfigStaggingMsg.setMessage(requestBody);
		gepConfigStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(gepConfigStaggingMsg, "configs.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<ExchangeConfigExcludeMappingDaoExt> gepConfigExcludeMappingDaoList) {
		List<SyncData> gepConfigExcludeMappingSyncDataList = new ArrayList<>();
		ExchangeConfigExcludeMappingSyncDtoExt gepConfigExcludeMappingSyncDto = new ExchangeConfigExcludeMappingSyncDtoExt();
		gepConfigExcludeMappingSyncDataList.add(DataSyncUtil.createSyncData(gepConfigExcludeMappingSyncDto.getSyncDtoList(gepConfigExcludeMappingDaoList), 0));
		return gepConfigExcludeMappingSyncDataList;
	}
}
