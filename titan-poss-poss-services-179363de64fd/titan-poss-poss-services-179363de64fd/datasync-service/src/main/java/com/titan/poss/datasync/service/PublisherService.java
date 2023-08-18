/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.concurrent.ExecutionException;

import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.datasync.dto.NotificationRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PublisherService {

	void publishToQueue(MessageRequest messageRequest, String id) throws InterruptedException, ExecutionException;

	void publishToSNS(MessageRequest messageRequest, String id) throws InterruptedException, ExecutionException;

	void publishToNotificationQueue(NotificationRequestDto notificationRequestDto, String id)
			throws InterruptedException, ExecutionException;

}
