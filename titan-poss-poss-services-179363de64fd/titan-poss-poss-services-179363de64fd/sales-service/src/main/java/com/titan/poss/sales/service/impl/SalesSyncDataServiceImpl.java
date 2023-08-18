/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.SalesSyncDataService;

import feign.Response;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SalesSyncDataServiceImpl implements SalesSyncDataService{
	@Autowired
	private SalesSyncStagingRepository salesSyncStagingRepository;
	
	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Value("${datasync.enable}")
	private boolean isEnabled;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SalesSyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	@Override
	public void publishSalesMessagesToQueue(SyncStagingDto data) {
		if (isEnabled) {
			try {
				data.getMessageRequest().setSource(CommonUtil.getLocationCode());
				LOGGER.info("Publishing Customer ");
				Response response = dataSyncServiceClient.publish(data.getMessageRequest());
				LOGGER.info("Published response Customer : {} ", response);
				if (response.status() == 200) {
					salesSyncStagingRepository.deleteById(data.getId());
					LOGGER.info("Published : {} ", data.getMessageRequest());
				}
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}
		}
	}

}
