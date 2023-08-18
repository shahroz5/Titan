/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.service.InventorySyncDataService;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class InventorySyncDataServiceImpl implements InventorySyncDataService {

	private static final Logger LOGGER = LoggerFactory.getLogger(InventorySyncDataServiceImpl.class);
	private static final String EXCEPTION = "exception : ";
	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	@Value("${datasync.enable}")
	private boolean isEnabled;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Override
	public void publishInventoryMessagesToQueue(SyncStagingDto invSyncStagingDto) {
		if (isEnabled) {

			Map<String, Boolean> statusMap = new HashMap<>();
			statusMap.put(ISOFFLINE, false);
			statusMap.put(ISPUBLISHTOEGHS, false);
			try {
				String destType = invSyncStagingDto.getMessageRequest().getDestinationType();
				if (destType.equals(DestinationType.SELECTIVE.name())) {
					String dest = invSyncStagingDto.getMessageRequest().getDestinations().get(0);
					getStatus(statusMap, dest);
				}
				deleteStagingAndPublish(statusMap, destType, invSyncStagingDto);

			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}

		}
	}

	/**
	 * @param statusMap
	 * @param destType
	 * @param invSyncStagingDto
	 */
	@Override
	public void deleteStagingAndPublish(Map<String, Boolean> statusMap, String destType,
			SyncStagingDto invSyncStagingDto) {
		try {
			if (statusMap.get(ISOFFLINE).booleanValue() || destType.equals(DestinationType.ALL.name())
					|| statusMap.get(ISPUBLISHTOEGHS).booleanValue()) {
				Response res = dataSyncServiceClient.publish(invSyncStagingDto.getMessageRequest());
				if (res.status() == 200) {
					inventorySyncStagingRepository.deleteById(invSyncStagingDto.getId());
					LOGGER.info("Published : {}", invSyncStagingDto.getMessageRequest());
				}
			} else {
				inventorySyncStagingRepository.deleteById(invSyncStagingDto.getId());
			}
		} catch (Exception e) {
			LOGGER.error(EXCEPTION, e);
		}

	}

	/**
	 * @param statusMap
	 * @param dest
	 */

	@Override
	public void getStatus(Map<String, Boolean> statusMap, String dest) {
		if (!dest.equals("EGHS")) {
			LocationCacheDto locationDto = engineServiceClient.getStoreLocation(dest);
			if (locationDto != null)
				statusMap.replace(ISOFFLINE, locationDto.getIsOffline());
		} else {
			statusMap.replace(ISPUBLISHTOEGHS, true);
		}
	}

}
