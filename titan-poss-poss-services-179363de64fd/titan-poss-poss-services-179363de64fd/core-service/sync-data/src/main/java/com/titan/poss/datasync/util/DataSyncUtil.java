/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.util;

import java.util.List;

import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageRequestData;
import com.titan.poss.core.dto.SyncData;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class DataSyncUtil {

	private DataSyncUtil() {

	}

	public static SyncData createSyncData(Object data, int order) {			
		
		SyncData syncData = new SyncData();
		syncData.setData(data);
		syncData.setOrder(order);
		
		return syncData;
	}

	/**
	 * @param syncDataList
	 * @param operation
	 * @param destinations
	 * @param messageType
	 * @param destinationType
	 * @return MessageRequest
	 */
	public static MessageRequest createMessageRequest(List<SyncData> data, String operation, List<String> destinations,
			String messageType, String destinationType) {
		MessageRequest messageRequest = new MessageRequest();

		MessageRequestData messageRequestData = new MessageRequestData();

		messageRequestData.setSyncData(data);
		messageRequestData.setOperation(operation);
		messageRequest.setMessageType(messageType);
		messageRequest.setDestinationType(destinationType);
		messageRequest.setDestinations(destinations);
		messageRequest.setMessageRequestData(messageRequestData);
		return messageRequest;
	}

}
