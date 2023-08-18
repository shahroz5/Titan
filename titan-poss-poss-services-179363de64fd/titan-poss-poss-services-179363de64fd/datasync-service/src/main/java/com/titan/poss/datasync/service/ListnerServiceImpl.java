/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.aws.messaging.config.annotation.NotificationMessage;
import org.springframework.cloud.aws.messaging.listener.SqsMessageDeletionPolicy;
import org.springframework.cloud.aws.messaging.listener.annotation.SqsListener;
import org.springframework.stereotype.Service;

import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.NotificationRequestDto;
import com.titan.poss.datasync.facade.ConsumeFacade;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ListnerServiceImpl implements ListnerService {

	@Autowired
	ConsumeFacade consumeFacade;

	@Autowired
	NotificationService notificationService;

	@Override
//	@SqsListener(value = "${env.name}" + '-' + "${aws.sqs.profile}"
//			+ "${general.data.queue}", deletionPolicy = SqsMessageDeletionPolicy.ALWAYS)
	public void readMessageFromGeneralQueue(@NotificationMessage MessageTransfer messageTransfer) {

		consumeFacade.consumeMessage(messageTransfer);

	}

	@Override
//	@SqsListener(value = "${env.name}" + '-' + "${aws.sqs.profile}"
//			+ "${priority.data.queue}", deletionPolicy = SqsMessageDeletionPolicy.ALWAYS)
	public void readMessageFromPriorityQueue(@NotificationMessage MessageTransfer messageTransfer) {
		consumeFacade.consumeMessage(messageTransfer);

	}

//	@SqsListener(value = "${env.name}" + '-' + "${aws.sqs.profile}"
//			+ "${notification.data.queue}", deletionPolicy = SqsMessageDeletionPolicy.ALWAYS)
	public void readNotification(@NotificationMessage NotificationRequestDto notificationRequest) {

		notificationService.updateNotificationStatus(notificationRequest);

	}

}
