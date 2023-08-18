/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

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
public interface PaymentSyncDataService {

	/**
	 * @param data
	 */
	public void publishPaymentMessagesToQueue(SyncStagingDto data);

	/**
	 * @param data
	 */
	void publishPaymentMessages(Map<String, SyncStagingDto> data);

	/**
	 * @param brandSyncDataList
	 * @param operation
	 * @param destinations
	 * @param isPublishToEGHS
	 * @param messageType
	 * @param destinationType
	 * @return Map<String, SyncStagingDto>
	 */
	Map<String, SyncStagingDto> getPaymentSyncStagingMap(List<SyncData> paymentSyncDataList, String operation,
			List<String> destinations, boolean isPublishToEGHS, String messageType, String destinationType);

	SyncStagingDto getEGHSSyncStagingDto(List<SyncData> paymentSyncDataList, String operation, String messageType);
}
