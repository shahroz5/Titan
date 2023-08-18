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
import com.titan.poss.product.dao.ComplexityPriceGroupDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.sync.dto.ComplexityPriceGroupSyncDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ComplexityPriceGroupMappingDatayncWriter implements ItemWriter<ComplexityPriceGroupDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;
	
	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends ComplexityPriceGroupDao> items) throws Exception {
		
		SyncStagingDto data = getStagingDto((List<ComplexityPriceGroupDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");
	}

	
	private SyncStagingDto getStagingDto(List<ComplexityPriceGroupDao> ComplexityPriceGroupMappingDaoList) {
		List<SyncData> ComplexityPriceGroupMappingSyncData = getSyncDataList(ComplexityPriceGroupMappingDaoList);
		List<String> destinations = new ArrayList<>();
		MessageRequest ComplexityPriceGroupMappingMsgeRequest = DataSyncUtil.createMessageRequest(ComplexityPriceGroupMappingSyncData, ProductOperationCodes.COMPLEXITY_PRICEGROUP_FILE,
				destinations, MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(ComplexityPriceGroupMappingMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(ComplexityPriceGroupMappingMsgeRequest);
		SyncStaging ComplexityPriceGroupMappingStaggingMsg = new SyncStaging();
		ComplexityPriceGroupMappingStaggingMsg.setMessage(requestBody);
		ComplexityPriceGroupMappingStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(ComplexityPriceGroupMappingStaggingMsg, "products.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}


	private List<SyncData> getSyncDataList(List<ComplexityPriceGroupDao> ComplexityPriceGroupMappingDaoList) {
		List<SyncData> ComplexityPriceGroupMappingSyncDataList = new ArrayList<>();
			ComplexityPriceGroupSyncDto ComplexityPriceGroupSyncDto = new ComplexityPriceGroupSyncDto();
			if (!ComplexityPriceGroupMappingDaoList.isEmpty())
				ComplexityPriceGroupMappingSyncDataList.add(
				DataSyncUtil.createSyncData(ComplexityPriceGroupSyncDto.getSyncDtoList(ComplexityPriceGroupMappingDaoList), 6));
		return ComplexityPriceGroupMappingSyncDataList;
	}

}
