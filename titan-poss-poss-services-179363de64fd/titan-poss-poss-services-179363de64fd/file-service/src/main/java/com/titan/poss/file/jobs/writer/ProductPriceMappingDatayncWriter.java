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
import com.titan.poss.product.dao.ProductPriceMappingDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.sync.dto.ProductPriceMappingSyncDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ProductPriceMappingDatayncWriter implements ItemWriter<ProductPriceMappingDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;
	
	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends ProductPriceMappingDao> items) throws Exception {
		
		SyncStagingDto data = getStagingDto((List<ProductPriceMappingDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");
	}

	
	private SyncStagingDto getStagingDto(List<ProductPriceMappingDao> productPriceMappingDaoList) {
		List<SyncData> productPriceMappingSyncData = getSyncDataList(productPriceMappingDaoList);
		List<String> destinations = new ArrayList<>();
		MessageRequest productPriceMappingMsgeRequest = DataSyncUtil.createMessageRequest(productPriceMappingSyncData, ProductOperationCodes.PRODUCT_PRICE_MAPPING_ADD,
				destinations, MessageType.FIFO.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(productPriceMappingMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(productPriceMappingMsgeRequest);
		SyncStaging productPriceMappingStaggingMsg = new SyncStaging();
		productPriceMappingStaggingMsg.setMessage(requestBody);
		productPriceMappingStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(productPriceMappingStaggingMsg, "products.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}


	private List<SyncData> getSyncDataList(List<ProductPriceMappingDao> productPriceMappingDaoList) {
		List<SyncData> productPriceMappingSyncDataList = new ArrayList<>();
			ProductPriceMappingSyncDto productPriceMappingSyncDto = new ProductPriceMappingSyncDto();
		productPriceMappingSyncDataList.add(
				DataSyncUtil.createSyncData(productPriceMappingSyncDto.getSyncDtoList(productPriceMappingDaoList), 0));
		return productPriceMappingSyncDataList;
	}

}
