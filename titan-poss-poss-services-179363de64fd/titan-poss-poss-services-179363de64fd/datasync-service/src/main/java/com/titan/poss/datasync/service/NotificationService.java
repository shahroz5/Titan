/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.titan.poss.datasync.dto.NotificationRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface NotificationService {

	void notifyToSender(NotificationRequestDto notificationRequest) throws InterruptedException, ExecutionException;

	void updateNotificationStatus(NotificationRequestDto notificationRequestDto);

}
