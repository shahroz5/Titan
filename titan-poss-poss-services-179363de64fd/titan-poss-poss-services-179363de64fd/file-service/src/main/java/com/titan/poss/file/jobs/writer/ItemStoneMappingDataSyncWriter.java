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
import com.titan.poss.datasync.dao.ItemStoneDatasyncStageDao;
import com.titan.poss.datasync.dto.ItemStoneStageDto;
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
public class ItemStoneMappingDataSyncWriter implements ItemWriter<ItemStoneDatasyncStageDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends ItemStoneDatasyncStageDao> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<ItemStoneDatasyncStageDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");
	}

	private SyncStagingDto getStagingDto(List<ItemStoneDatasyncStageDao> itemStoneList) {

		List<SyncData> itemStoneSyncData = getSyncDataList(itemStoneList);
		List<String> destinations = new ArrayList<>();
		MessageRequest itemStoneMsgeRequest = DataSyncUtil.createMessageRequest(itemStoneSyncData,
				ProductOperationCodes.ITEM_STONE_BULK, destinations, MessageType.GENERAL.toString(),
				DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(itemStoneMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(itemStoneMsgeRequest);
		SyncStaging itemStoneStaggingMsg = new SyncStaging();
		itemStoneStaggingMsg.setMessage(requestBody);
		itemStoneStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(itemStoneStaggingMsg, "products.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<ItemStoneDatasyncStageDao> itemStoneList) {
		List<ItemStoneStageDto> itemStoneSyncDtoList = new ArrayList<>();
		List<SyncData> itemStoneSyncDataList = new ArrayList<>();
		itemStoneList.stream().forEach(itemStone -> {
			ItemStoneStageDto itemStoneMappingSyncDtoExt = new ItemStoneStageDto(itemStone);
			itemStoneSyncDtoList.add(itemStoneMappingSyncDtoExt);
		});
		itemStoneSyncDataList.add(DataSyncUtil.createSyncData(itemStoneSyncDtoList, 0));
		return itemStoneSyncDataList;
	}

}
