/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSAsync;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSAsync;
import com.amazonaws.services.sqs.model.AmazonSQSException;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.amazonaws.services.sqs.model.SendMessageResult;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.NotificationRequestDto;
import com.titan.poss.datasync.util.SQSmessageBody;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SQSService {

	@Value("${cloud.aws.sns.general.arn}")
	private String snsGeneralTopicARN;

	@Value("${cloud.aws.sns.priority.arn}")
	private String snsPriorityTopicARN;

	@Value("${cloud.aws.sqs.baseurl}")
	private String queueBaseUrl;

	@Value("${general.data.queue}")
	private String generalQueue;

	@Value("${priority.data.queue}")
	private String priorityQueue;

	@Value("${fifo.data.queue}")
	private String fifoQueue;
	
	@Value("${notification.data.queue}")
	private String notification;

	@Value("${env.name}")
	private String env;

	@Autowired
	AmazonSQS amazonSQSAsync;

	@Autowired
	AmazonSNS amazonSNSAsync;

	private static final Logger LOGGER = LoggerFactory.getLogger(SQSService.class);

//	@Async
	public Future<String> sendToSQS(MessageTransfer messageTransfer, String destination) {
		String queueUrl = getQueueUrl(messageTransfer.getMessageType(), destination);
		SQSmessageBody sqsMessageBody = new SQSmessageBody();
		sqsMessageBody.setMessage(MapperUtil.getJsonString(messageTransfer));
		String ms = MapperUtil.getJsonString(sqsMessageBody);
		SendMessageResult sr = null;
		String messageId = null;
		try {
		if (messageTransfer.getMessageType().equals(MessageType.FIFO.name())) {
			SendMessageRequest sendMessageRequest = new SendMessageRequest().withQueueUrl(queueUrl)
					.withMessageGroupId("inventory")
					.withMessageDeduplicationId(messageTransfer.getMessageTransferData().getId()).withMessageBody(ms);
			sr = amazonSQSAsync.sendMessage(sendMessageRequest);
		} else {
			sr = amazonSQSAsync.sendMessage(queueUrl, ms);
		}
		} catch (AmazonSQSException e) {
			LOGGER.warn("Failed to publish to SQS location {} ", destination);
			LOGGER.error(e.getErrorMessage());
			LOGGER.error(e.getMessage());
		}
		if (sr != null) {
			messageId = sr.getMessageId();
		}
		return new AsyncResult<>(messageId);
	}

	public String getQueueUrl(MessageType messageType, String destination) {
		String queuetype = "";
		String queueUrl;
		if (messageType.name().equals(MessageType.GENERAL.name())) {
			queuetype = generalQueue;
		} else if (messageType.name().equals(MessageType.PRIORITY.name())) {
			queuetype = priorityQueue;
		} else if (messageType.name().equals(MessageType.FIFO.name())) {
			queuetype = fifoQueue;
		}else if (messageType.name().equals(MessageType.NOTIFICATION.name())) {
			queuetype = notification;
		}

		queueUrl = queueBaseUrl + env + '-' + destination + queuetype;
		return queueUrl;

	}

	public String getQueueUrl(String messageType, String destination) {
		String queuetype = "";
		String queueUrl;
		if (messageType.equals(MessageType.GENERAL.name())) {
			queuetype = generalQueue;
		} else if (messageType.equals(MessageType.PRIORITY.name())) {
			queuetype = priorityQueue;
		} else if (messageType.equals(MessageType.FIFO.name())) {
			queuetype = fifoQueue;
		}else if (messageType.equals(MessageType.NOTIFICATION.name())) {
			queuetype = notification;
		}

		queueUrl = queueBaseUrl + env + '-' + destination + queuetype;
		return queueUrl;

	}

	@Async
	public Future<String> sendToNotificationSQS(NotificationRequestDto notificationRequestDto) {
		String queueUrl = getQueueUrl(MessageType.NOTIFICATION, notificationRequestDto.getSource());
		SQSmessageBody sqsMessageBody = new SQSmessageBody();
		sqsMessageBody.setMessage(MapperUtil.getJsonString(notificationRequestDto));
		String ms = MapperUtil.getJsonString(sqsMessageBody);
		SendMessageResult sr;
		sr = amazonSQSAsync.sendMessage(queueUrl, ms);
		return new AsyncResult<>(sr.getMessageId());
	}

}
