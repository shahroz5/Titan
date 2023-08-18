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
import com.titan.poss.datasync.dao.StoneDataSyncStageDao;
import com.titan.poss.datasync.dto.StoneSyncStageDto;
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
public class StoneMasterDataSyncWriter implements ItemWriter<StoneDataSyncStageDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends StoneDataSyncStageDao> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<StoneDataSyncStageDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");
	}

	private SyncStagingDto getStagingDto(List<StoneDataSyncStageDao> stoneList) {

		List<SyncData> materialSyncData = getSyncDataList(stoneList);
		List<String> destinations = new ArrayList<>();
		MessageRequest stoneMsgeRequest = DataSyncUtil.createMessageRequest(materialSyncData,
				ProductOperationCodes.STONE_BULK, destinations, MessageType.GENERAL.toString(),
				DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(stoneMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(stoneMsgeRequest);
		SyncStaging stoneStaggingMsg = new SyncStaging();
		stoneStaggingMsg.setMessage(requestBody);
		stoneStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(stoneStaggingMsg, "products.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<StoneDataSyncStageDao> stoneList) {
		List<SyncData> stoneSyncDataList = new ArrayList<>();
		stoneList.stream().forEach(stone -> {
			StoneSyncStageDto stoneSyncDto = new StoneSyncStageDto(stone);
			stoneSyncDataList.add(DataSyncUtil.createSyncData(stoneSyncDto, 0));
		});
		return stoneSyncDataList;
	}

}