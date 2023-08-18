/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.dto.SyncStagingDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface LocationSyncDataService {
	
	/**
	 * @param locationCode
	 */
	void createQueue(String locationCode);

	/**
	 * @param data
	 */
	void publishLocationMessagesToQueue(SyncStagingDto data);
	
	void publishLocationMessagesToQueueWithToken(SyncStagingDto data);

	/**
	 * @param data
	 */
	void publishLocationMessages(Map<String, SyncStagingDto> data);

	/**
	 * @param locSyncDataList
	 * @param operation
	 * @param destinations
	 * @param isPublishToEGHS
	 * @param messageType
	 * @param destinationType
	 * @return Map<String, SyncStagingDto>
	 */
	Map<String, SyncStagingDto> getLocationSyncStagingMap(List<SyncData> locSyncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType);

}
