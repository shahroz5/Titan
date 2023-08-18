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
import com.titan.poss.datasync.dao.ItemMaterialDatasyncStageDao;
import com.titan.poss.datasync.dto.ItemMaterialStageDto;
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
public class ItemMaterialMappingDataSyncWriter implements ItemWriter<ItemMaterialDatasyncStageDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends ItemMaterialDatasyncStageDao> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<ItemMaterialDatasyncStageDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");
	}

	private SyncStagingDto getStagingDto(List<ItemMaterialDatasyncStageDao> itemMaterialList) {

		List<SyncData> itemMaterialSyncData = getSyncDataList(itemMaterialList);
		List<String> destinations = new ArrayList<>();
		MessageRequest itemMaterialMsgeRequest = DataSyncUtil.createMessageRequest(itemMaterialSyncData,
				ProductOperationCodes.ITEM_MATERIAL_BULK, destinations, MessageType.GENERAL.toString(),
				DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(itemMaterialMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(itemMaterialMsgeRequest);
		SyncStaging itemMaterialStaggingMsg = new SyncStaging();
		itemMaterialStaggingMsg.setMessage(requestBody);
		itemMaterialStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(itemMaterialStaggingMsg, "products.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<ItemMaterialDatasyncStageDao> itemMaterialList) {
		List<ItemMaterialStageDto> itemMaterialSyncDtoList = new ArrayList<>();
		List<SyncData> itemMaterialSyncDataList = new ArrayList<>();
		itemMaterialList.stream().forEach(itemMaterial -> {
			ItemMaterialStageDto itemMaterialMappingSyncDto = new ItemMaterialStageDto(itemMaterial);
			itemMaterialSyncDtoList.add(itemMaterialMappingSyncDto);
		});
		itemMaterialSyncDataList.add(DataSyncUtil.createSyncData(itemMaterialSyncDtoList, 0));
		return itemMaterialSyncDataList;
	}

}