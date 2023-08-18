/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service;

import com.titan.poss.datasync.dto.SyncStagingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ProductDataSyncService {

	public void publishProductMessagesToQueue(SyncStagingDto data, String tableName);

}
