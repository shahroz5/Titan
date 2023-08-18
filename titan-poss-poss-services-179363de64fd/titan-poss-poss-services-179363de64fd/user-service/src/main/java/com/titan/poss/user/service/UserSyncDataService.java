/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.dto.SyncStagingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface UserSyncDataService {

	/**
	 * @param syncStaging
	 */
	void publishUserMessagesToQueue(SyncStagingDto syncStagingDto);
	
	/**
	 * @param data
	 */
	void publishUserMessages(Map<String, SyncStagingDto> data);

	/**
	 * @param locSyncDataList
	 * @param operation
	 * @param destinations
	 * @param isPublishToEGHS
	 * @param messageType
	 * @param destinationType
	 * @return Map<String, SyncStagingDto>
	 */
	Map<String, SyncStagingDto> getUserSyncStagingMap(List<SyncData> userSyncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType);

}
