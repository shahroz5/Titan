/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.datasync.dto.SyncStagingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface DataSyncService {

	public void publishProductMessagesToQueue(SyncStagingDto data, String tableName);

}
