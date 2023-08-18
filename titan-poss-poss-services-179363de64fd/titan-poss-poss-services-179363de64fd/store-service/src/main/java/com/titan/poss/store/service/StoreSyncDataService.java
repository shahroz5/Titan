package com.titan.poss.store.service;

import org.springframework.stereotype.Service;

import com.titan.poss.datasync.dto.SyncStagingDto;
@Service
public interface StoreSyncDataService {
	/**
	 * @param data
	 */
	public void publishPaymentMessagesToQueue(SyncStagingDto data);
}
