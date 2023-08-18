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
import com.titan.poss.datasync.dao.MaterialDatasyncStageDao;
import com.titan.poss.datasync.dto.MaterialSyncStageDto;
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
public class MaterialMasterDataSyncWriter implements ItemWriter<MaterialDatasyncStageDao> {

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends MaterialDatasyncStageDao> items) throws Exception {

		SyncStagingDto data = getStagingDto((List<MaterialDatasyncStageDao>) items);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");
	}

	private SyncStagingDto getStagingDto(List<MaterialDatasyncStageDao> materialList) {

		List<SyncData> materialSyncData = getSyncDataList(materialList);
		List<String> destinations = new ArrayList<>();
		MessageRequest materialMsgeRequest = DataSyncUtil.createMessageRequest(materialSyncData,
				ProductOperationCodes.MATERIAL_BULK, destinations, MessageType.GENERAL.toString(),
				DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(materialMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(materialMsgeRequest);
		SyncStaging materialStaggingMsg = new SyncStaging();
		materialStaggingMsg.setMessage(requestBody);
		materialStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(materialStaggingMsg, "products.dbo.sync_staging");
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getSyncDataList(List<MaterialDatasyncStageDao> materialList) {
		List<SyncData> materialSyncDataList = new ArrayList<>();
		materialList.stream().forEach(material -> {
			MaterialSyncStageDto materialSyncDto = new MaterialSyncStageDto(material);
			materialSyncDataList.add(DataSyncUtil.createSyncData(materialSyncDto, 0));
		});
		return materialSyncDataList;
	}

}
