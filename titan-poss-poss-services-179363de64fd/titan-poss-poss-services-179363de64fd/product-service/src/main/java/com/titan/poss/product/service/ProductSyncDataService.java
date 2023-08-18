/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.datasync.dto.SyncStagingDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface ProductSyncDataService {
	
	/**
	 * @param data
	 */
	void publishProductMessagesToQueue(SyncStagingDto data);

	/**
	 * @param data
	 */
	void publishProductMessages(Map<String, SyncStagingDto> data);
	
}
