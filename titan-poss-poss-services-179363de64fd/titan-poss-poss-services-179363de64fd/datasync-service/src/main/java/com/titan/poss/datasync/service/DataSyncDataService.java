package com.titan.poss.datasync.service;

import com.titan.poss.datasync.dto.SyncStagingDto;

public interface DataSyncDataService {
	public void publishDataSyncDataToQueue(String token, SyncStagingDto data);
}
