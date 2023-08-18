/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.datasync.dto.LocationQueueDto;
import com.titan.poss.datasync.util.QueueTypeEnum;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface QueueManagementService {

	List<LocationQueueDto> createAllQueueForLocation(String locationCode);

	void saveLocationQueue(String locationCode, List<LocationQueueDto> locationQueueDto);

	LocationQueueDto createLocationQueue(String locationCode, QueueTypeEnum queueType);

	String createQueue(String queueName);

	String createFifoQueue(String queueName);

	void subscribeToSNS(String snsTopicARN, String queueUrl);

	void disableLocationQueue(String location);

}