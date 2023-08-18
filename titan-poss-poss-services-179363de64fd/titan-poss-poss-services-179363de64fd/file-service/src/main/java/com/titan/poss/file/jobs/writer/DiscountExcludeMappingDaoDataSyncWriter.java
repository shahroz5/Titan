/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;

import com.titan.poss.config.dao.DiscountExcludeMappingDao;
import com.titan.poss.config.dto.DiscountExcludeMappingSyncDto;
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
import com.titan.poss.product.dao.SyncStaging;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class DiscountExcludeMappingDaoDataSyncWriter implements ItemWriter<DiscountExcludeMappingDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends DiscountExcludeMappingDao> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<DiscountExcludeMappingDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "configs.dbo.sync_staging");

	}

	/**
	 * @param items
	 * @return
	 */
	private SyncStagingDto getStagingDto(List<DiscountExcludeMappingDao> items) {
		List<SyncData> itemDiscountSyncData = getSyncDataList(items);
		List<String> destinations = new ArrayList<>();
		MessageRequest itemDiscountMsgeRequest = DataSyncUtil.createMessageRequest(itemDiscountSyncData,
				ProductOperationCodes.ITEM_GROUP_LEVEL_DISCOUNT_ADD, destinations, MessageType.GENERAL.toString(),
				DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(itemDiscountMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(itemDiscountMsgeRequest);
		SyncStaging itemDiscountStaggingMsg = new SyncStaging();
		itemDiscountStaggingMsg.setMessage(requestBody);
		itemDiscountStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(itemDiscountStaggingMsg, "configs.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<DiscountExcludeMappingDao> discountItemMappingDaoList) {
		List<SyncData> itemDiscountSyncDataList = new ArrayList<>();
		DiscountExcludeMappingSyncDto discountExcludeMappingSyncDto = new DiscountExcludeMappingSyncDto();
		if (!discountItemMappingDaoList.isEmpty())
			itemDiscountSyncDataList.add(DataSyncUtil
					.createSyncData(discountExcludeMappingSyncDto.getSyncDtos(discountItemMappingDaoList), 6));

		return itemDiscountSyncDataList;
	}

}
