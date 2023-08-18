/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.integration.repository.IntegrationSyncStagingRepository;
import com.titan.poss.integration.service.IntegrationSyncDataService;

import feign.Response;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class IntegrationSyncDataServiceImpl implements IntegrationSyncDataService{
	
	@Autowired
	private  IntegrationSyncStagingRepository integrationSyncRepo;
	
	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;
	
	@Value("${datasync.enable}")
	private boolean isEnabled;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(IntegrationSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void publishIntegrationMessagesToQueue(SyncStagingDto data) {
		if (isEnabled) {
			try {
				data.getMessageRequest().setSource(CommonUtil.getLocationCode());
				Response response = dataSyncServiceClient.publish(data.getMessageRequest());
				if (response.status() == 200) {
					integrationSyncRepo.deleteById(data.getId());
					LOGGER.info("Published : {} ", data.getMessageRequest());
				}
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
		
	}

}
