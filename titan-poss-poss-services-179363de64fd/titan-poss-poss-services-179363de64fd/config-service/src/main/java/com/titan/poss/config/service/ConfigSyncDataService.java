/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.service;

import java.util.List;
import java.util.Map;

import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.dto.SyncStagingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface ConfigSyncDataService {

	/**
	 * @param syncStaging
	 */
	void publishConfigMessagesToQueue(SyncStagingDto syncStagingDto);

	/**
	 * @param data
	 */
	void publishConfigMessages(Map<String, SyncStagingDto> data);

	/**
	 * @param locSyncDataList
	 * @param operation
	 * @param destinations
	 * @param isPublishToEGHS
	 * @param messageType
	 * @param destinationType
	 * @return Map<String, SyncStagingDto>
	 */
	Map<String, SyncStagingDto> getConfigSyncStagingMap(List<SyncData> locSyncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType);
}
