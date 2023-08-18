/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.datasync.dto.SyncStagingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface InventorySyncDataService {

	/**
	 * @param data
	 */
	void publishInventoryMessagesToQueue(SyncStagingDto syncStaging);
	
	void getStatus(Map<String, Boolean> statusMap, String dest);
	
	void deleteStagingAndPublish(Map<String, Boolean> statusMap, String destType,
			SyncStagingDto invSyncStagingDto);

}
