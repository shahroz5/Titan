/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.Message;
import com.amazonaws.services.sqs.model.ReceiveMessageRequest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.NotificationRequestDto;
import com.titan.poss.datasync.facade.ConsumeFacade;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class QueueListner {

	@Autowired
	AmazonSQS amazonSQSAsync;

	@Autowired
	ConsumeFacade consumeFacade;

	@Autowired
	NotificationService notificationService;

	private static final Logger LOGGER = LoggerFactory.getLogger(QueueListner.class);

	@Value("${app.name}")
	private String appName;
	
	@Value("${general.data.queue}")
	private String generalQueue;
	
	@Value("${priority.data.queue}")
	private String priorityQueue;
	
	@Value("${notification.data.queue}")
	private String notificationQueue;

	@Value("${env.name}")
	private String env;

	@Value("${cloud.aws.sqs.baseurl}")
	private String queueBaseUrl;

	@Value("${fifo.data.queue}")
	private String fifoQueue;
	
	@Value("${aws.sqs.profile}")
	private String appLocation;
	
	
	/**
	 * @param generalQueueUrl
	 * @throws InterruptedException 
	 * 
	 */
	@Scheduled(fixedDelay = 10, initialDelay = 10000)
	public void generalQueueListner() {
		String generalQueueUrl = queueBaseUrl + env + '-' + appLocation + generalQueue;
	
			ReceiveMessageRequest mr = new ReceiveMessageRequest();
			mr.setMaxNumberOfMessages(1);
			mr.withWaitTimeSeconds(20);
			mr.setQueueUrl(generalQueueUrl);
			
			List<Message> messages = amazonSQSAsync.receiveMessage(mr).getMessages();
			LOGGER.info("Calling General Queue. No of messages : " + messages.size());
			for (Message m : messages) {
				try {
					@SuppressWarnings("unchecked")
					Map<String, String> obj = (Map<String, String>) MapperUtil.getJsonFromString(m.getBody());
					ObjectMapper objectMapper = new ObjectMapper();
					MessageTransfer messageTransfer = objectMapper.convertValue(
							MapperUtil.getJsonFromString(obj.get("Message")), new TypeReference<MessageTransfer>() {
							});
					
					consumeFacade.consumeMessage(messageTransfer);
				}catch(Exception ex) {
					LOGGER.error(ex.getMessage());
				}
				LOGGER.info("DELETING Message from QUEUE :: {}",m.getMessageId());
				amazonSQSAsync.deleteMessage(generalQueueUrl, m.getReceiptHandle());
			}
		
	}

	/**
	 * @param fifoQueueUrl
	 */
	@Scheduled(fixedDelay = 10, initialDelay = 10000)
	public void fifoQueueLister() {
		
		String fifoQueueUrl = queueBaseUrl + env + '-' + appLocation + fifoQueue;
		
			ReceiveMessageRequest mr = new ReceiveMessageRequest();
			mr.setMaxNumberOfMessages(10);
			mr.withWaitTimeSeconds(10);
			mr.setQueueUrl(fifoQueueUrl);
			
			List<Message> messages = amazonSQSAsync.receiveMessage(mr).getMessages();
			LOGGER.info("Calling FIFO Queue. No of messages : " + messages.size());
			for (Message m : messages) {
				try {
					@SuppressWarnings("unchecked")
					Map<String, String> obj = (Map<String, String>) MapperUtil.getJsonFromString(m.getBody());
					ObjectMapper objectMapper = new ObjectMapper();
					MessageTransfer messageTransfer = objectMapper.convertValue(
							MapperUtil.getJsonFromString(obj.get("Message")), new TypeReference<MessageTransfer>() {
							});
					LOGGER.info("Starting to consume message",messageTransfer.getMessageTransferData().getId());
					consumeFacade.consumeMessage(messageTransfer);
				}catch(Exception ex) {
					LOGGER.error(ex.getMessage());
				}
				LOGGER.info("DELETING Message from QUEUE :: {}",m.getMessageId());
				amazonSQSAsync.deleteMessage(fifoQueueUrl, m.getReceiptHandle());

			}
			
		}
	
	@Scheduled(fixedDelay = 10, initialDelay = 15000)
	public void notificationQueueListner() {
		String notificationQueueUrl = queueBaseUrl + env + '-' + appLocation + notificationQueue;
	
			ReceiveMessageRequest mr = new ReceiveMessageRequest();
			mr.setMaxNumberOfMessages(1);
			mr.withWaitTimeSeconds(20);
			mr.setQueueUrl(notificationQueueUrl);
			
			List<Message> messages = amazonSQSAsync.receiveMessage(mr).getMessages();
			LOGGER.info("Calling Notification Queue. No of messages : " + messages.size());
			for (Message m : messages) {
				try {
					@SuppressWarnings("unchecked")
					Map<String, String> obj = (Map<String, String>) MapperUtil.getJsonFromString(m.getBody());
					ObjectMapper objectMapper = new ObjectMapper();
					NotificationRequestDto notificationRequest = objectMapper.convertValue(
							MapperUtil.getJsonFromString(obj.get("Message")), new TypeReference<NotificationRequestDto>() {
							});
					
					notificationService.updateNotificationStatus(notificationRequest);
				}catch(Exception ex) {
					LOGGER.error(ex.getMessage());
				}
				LOGGER.info("DELETING Message from QUEUE :: {}",m.getMessageId());
				amazonSQSAsync.deleteMessage(notificationQueueUrl, m.getReceiptHandle());
			}
		
	}
	
	
	@Scheduled(fixedDelay = 1000, initialDelay = 15000)
	public void priorityQueueListner() {
		String priorityQueueUrl = queueBaseUrl + env + '-' + appLocation + priorityQueue;
	
			ReceiveMessageRequest mr = new ReceiveMessageRequest();
			mr.setMaxNumberOfMessages(1);
			mr.withWaitTimeSeconds(20);
			mr.setQueueUrl(priorityQueueUrl);
			
			List<Message> messages = amazonSQSAsync.receiveMessage(mr).getMessages();
			LOGGER.info("Calling Priority Queue. No of messages : " + messages.size());
			for (Message m : messages) {
				try {
					@SuppressWarnings("unchecked")
					Map<String, String> obj = (Map<String, String>) MapperUtil.getJsonFromString(m.getBody());
					ObjectMapper objectMapper = new ObjectMapper();
					MessageTransfer messageTransfer = objectMapper.convertValue(
							MapperUtil.getJsonFromString(obj.get("Message")), new TypeReference<MessageTransfer>() {
							});
					
					consumeFacade.consumeMessage(messageTransfer);
				}catch(Exception ex) {
					LOGGER.error(ex.getMessage());
				}
				LOGGER.info("DELETING Message from QUEUE :: {}",m.getMessageId());
				amazonSQSAsync.deleteMessage(priorityQueueUrl, m.getReceiptHandle());
			}
		
	}

	
}
