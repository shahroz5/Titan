/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.sns.model.AmazonSNSException;
import com.amazonaws.services.sqs.model.AmazonSQSException;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageTransferData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.NotificationRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PublisherServiceImpl implements PublisherService {

	@Value("${aws.sqs.profile}")
	private String appLocation;

	private static final Logger LOGGER = LoggerFactory.getLogger(PublisherServiceImpl.class);

	private static String publishReference = "\n\nPUBLISHED {} with refId: {}\n";

	@Autowired
	SNSService snsService;

	@Autowired
	SQSService sqsService;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Override
	public void publishToSNS(MessageRequest messageRequest, String id) throws InterruptedException, ExecutionException {

		MessageTransfer messageTransfer = convertToMessageTransfer(messageRequest, id);
		/* Async Publish to SNS */
		try {
			LOGGER.info("\n\nPUBLISHING : {} : {} to SNS Queue\n",
					messageTransfer.getMessageTransferData().getOperation(), id);
			Future<String> messageRefId = snsService.sendToSNS(messageTransfer);
			LOGGER.info(PublisherServiceImpl.publishReference, messageTransfer.getMessageTransferData().getOperation(),
					messageRefId.get());
			/* Update status and msgrefid in DB */
			updateMessageStatusAndRefId(id, messageRefId.get(), DatasyncStatusEnum.IN_QUEUE.name());
		} catch (AmazonSNSException e) {
			LOGGER.warn("Message {}, failed to publish to SNS ", id, e);
		} catch (AmazonClientException e) {
			LOGGER.warn("No Internet ", e);
		}
	}

	private MessageTransfer convertToMessageTransfer(MessageRequest messageRequest, String id) {
		MessageTransfer messageTransfer = new MessageTransfer();
		MessageTransferData data = new MessageTransferData();
		MapperUtil.beanMapping(messageRequest.getMessageRequestData(), data);
		data.setId(id);
		if (messageRequest.getSource() != null) {
			data.setSource(messageRequest.getSource());
		} else {
			data.setSource(appLocation);
			
		}
		messageTransfer.setMessageTransferData(data);
		messageTransfer.setMessageType(messageRequest.getMessageType());
		return messageTransfer;
	}

	@Async
	public void updateMessageStatusAndRefId(String id, String messageRefId, String status) {
		datasyncAuditService.updateMessageRefIdAndStatusById(id, messageRefId, status);
	}

	@Async
	private void updateMessageStatusAndRefIdAndDestination(String id, String messageRefId, String status, String dest) {
		datasyncAuditService.updateMessageRefIdAndStatusByIdAndDestination(id, messageRefId, status, dest);
	}

	@Override
	public void publishToQueue(MessageRequest messageRequest, String id)
			throws InterruptedException, ExecutionException {

		MessageTransfer messageTransfer = convertToMessageTransfer(messageRequest, id);
		
		for (String dest : messageRequest.getDestinations()) {
			messageTransfer.getMessageTransferData().setDestination(dest);
			publishMessageTransfer(messageTransfer, dest, id);
		}

	}

	public void publishMessageTransfer(MessageTransfer messageTransfer, String dest, String id)
			throws InterruptedException, ExecutionException {
		try {
			LOGGER.info("\n\nPUBLISHING : {} : {} to SQS Queue\n",
					messageTransfer.getMessageTransferData().getOperation(), id);
			Future<String> messageRefId = sqsService.sendToSQS(messageTransfer, dest);
			LOGGER.info(PublisherServiceImpl.publishReference, messageTransfer.getMessageTransferData().getOperation(),
					messageRefId.get());
			updateMessageStatusAndRefIdAndDestination(id, messageRefId.get(), DatasyncStatusEnum.IN_QUEUE.name(), dest);
		} catch (AmazonSQSException e) {
			LOGGER.warn("Message  {}, failed to publish to SQS location {} ", id, dest);
			LOGGER.error(e.getErrorMessage());
			LOGGER.error(e.getMessage());
		}
	}

	@Override
	@Async
	public void publishToNotificationQueue(NotificationRequestDto notificationRequestDto, String id)
			throws InterruptedException, ExecutionException {

		try {
			LOGGER.info("\n\nNOTIFICATION PUBLISHING : {} : {} to SQS Queue\n",
					"NOTIFY-" + notificationRequestDto.getOperation(), id);
			Future<String> messageRefId = sqsService.sendToNotificationSQS(notificationRequestDto);
			LOGGER.info(PublisherServiceImpl.publishReference, "NOTIFY-" + notificationRequestDto.getOperation(),
					messageRefId.get());
			updateMessageStatusAndRefId(id, messageRefId.get(), DatasyncStatusEnum.IN_QUEUE.name());
		} catch (AmazonSQSException e) {
			LOGGER.warn("Message  {}, failed to publish to SQS location {} ", id,
					notificationRequestDto.getDestination());
		}

	}

}
