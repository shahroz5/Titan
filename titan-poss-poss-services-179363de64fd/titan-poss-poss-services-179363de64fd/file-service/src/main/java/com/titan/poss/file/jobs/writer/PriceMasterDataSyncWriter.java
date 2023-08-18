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
import com.titan.poss.file.dto.PriceSyncDtoExt;
import com.titan.poss.file.service.impl.DataSyncServiceImpl;
import com.titan.poss.product.dao.PriceDao;
import com.titan.poss.product.dao.SyncStaging;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PriceMasterDataSyncWriter implements ItemWriter<PriceDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends PriceDao> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<PriceDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");
	}

	private SyncStagingDto getStagingDto(List<PriceDao> priceList) {

		List<SyncData> priceSyncData = getSyncDataList(priceList);
		List<String> destinations = new ArrayList<>();
		MessageRequest priceMsgeRequest = DataSyncUtil.createMessageRequest(priceSyncData,
				ProductOperationCodes.PRICE_BULK, destinations, MessageType.GENERAL.toString(),
				DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(priceMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(priceMsgeRequest);
		SyncStaging priceStaggingMsg = new SyncStaging();
		priceStaggingMsg.setMessage(requestBody);
		priceStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(priceStaggingMsg, "payments.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<PriceDao> priceList) {
		List<SyncData> priceSyncDataList = new ArrayList<>();
		priceList.stream().forEach(price -> {
			PriceSyncDtoExt priceSyncDto = new PriceSyncDtoExt(price);
			priceSyncDataList.add(DataSyncUtil.createSyncData(priceSyncDto, 0));
		});
		return priceSyncDataList;
	}

}
