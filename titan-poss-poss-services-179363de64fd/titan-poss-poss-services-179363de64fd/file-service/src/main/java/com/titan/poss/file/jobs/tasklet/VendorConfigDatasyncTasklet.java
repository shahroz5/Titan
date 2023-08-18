/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.IntegrationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.file.service.impl.DataSyncServiceImpl;
import com.titan.poss.integration.dao.SyncStaging;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dto.VendorConfigSyncDto;
import com.titan.poss.integration.repository.IntegrationSyncStagingRepository;
import com.titan.poss.integration.repository.VendorConfigRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class VendorConfigDatasyncTasklet implements Tasklet {

	@Autowired
	private VendorConfigRepository vendorConfigRepository;

	@Autowired
	private IntegrationSyncStagingRepository integrationSyncStagingRepository;

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getJobParameters().get("fileAuditId");
		List<VendorConfigDao> vendorConfigs = vendorConfigRepository.findByCorrelationId(fileId);

		SyncStagingDto syncStagingDto = new SyncStagingDto();
		VendorConfigSyncDto vendorConfigDto = new VendorConfigSyncDto();
		List<SyncData> syncDatas = new ArrayList<>();
		syncDatas.add(DataSyncUtil.createSyncData(vendorConfigDto.getSyncDtoList(vendorConfigs), 0));
		List<String> destinations = new ArrayList<>();
		destinations.add(vendorConfigs.get(0).getLocationCode());
		MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDatas,
					IntegrationOperationCodes.VENDOR_CONFIGS, destinations, MessageType.GENERAL.toString(),
					DestinationType.SELECTIVE.toString());
		syncStagingDto.setMessageRequest(messageRequest);
		String requestBody = MapperUtil.getJsonString(messageRequest);
		// saving to staging table
		SyncStaging stagingMessage = new SyncStaging();
		stagingMessage.setMessage(requestBody);
		stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		syncStagingDto.setId(integrationSyncStagingRepository.save(stagingMessage).getId());
		syncDataService.publishProductMessagesToQueue(syncStagingDto, "integration.dbo.sync_staging");

		return RepeatStatus.FINISHED;
	}

}
