/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSAsync;
import com.amazonaws.services.sns.util.Topics;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSAsync;
import com.amazonaws.services.sqs.model.CreateQueueRequest;
import com.amazonaws.services.sqs.model.CreateQueueResult;
import com.titan.poss.datasync.dto.LocationQueueDto;
import com.titan.poss.datasync.util.QueueNameConstant;
import com.titan.poss.datasync.util.QueueTypeEnum;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class QueueManagementServiceImpl implements QueueManagementService {

	@Value("${cloud.aws.sns.general.arn}")
	private String snsGeneralTopicARN;

	@Value("${cloud.aws.sns.priority.arn}")
	private String snsPriorityTopicARN;

	@Value("${env.name}")
	private String env;

	@Autowired
	AmazonSQS amazonSQSAsync;

	@Autowired
	AmazonSNS amazonSNSAsync;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Override
	public List<LocationQueueDto> createAllQueueForLocation(String locationCode) {

		List<LocationQueueDto> queueUrllist = new ArrayList<>();
		queueUrllist.add(createLocationQueue(locationCode, QueueTypeEnum.GENERAL));
		queueUrllist.add(createLocationQueue(locationCode, QueueTypeEnum.PRIORITY));
		queueUrllist.add(createLocationQueue(locationCode, QueueTypeEnum.NOTIFICATION));
		queueUrllist.add(createLocationQueue(locationCode, QueueTypeEnum.FIFO));
		saveLocationQueue(locationCode, queueUrllist);
		return queueUrllist;

	}

	@Override
	public void saveLocationQueue(String locationCode, List<LocationQueueDto> locationQueueDto) {

		datasyncAuditService.addQueueToLocation(locationCode, locationQueueDto);

	}

	@Override
	public LocationQueueDto createLocationQueue(String locationCode, QueueTypeEnum queueType) {
		LocationQueueDto loc = new LocationQueueDto();
		String queueName = "";
		String queueUrl = "";
		if (queueType.name().equals(QueueTypeEnum.GENERAL.name())) {
			queueName = env + '-' + locationCode + QueueNameConstant.GENERAL_QUEUE;
			queueUrl = createQueue(queueName);
			loc.setQueueName(QueueTypeEnum.GENERAL.name());
			loc.setQueueUrl(queueUrl);
			subscribeToSNS(snsGeneralTopicARN, queueUrl);
			return loc;
		}

		if (queueType.name().equals(QueueTypeEnum.PRIORITY.name())) {
			queueName = env + '-' + locationCode + QueueNameConstant.PRIORITY_QUEUE;
			queueUrl = createQueue(queueName);
			loc.setQueueName(QueueTypeEnum.PRIORITY.name());
			loc.setQueueUrl(queueUrl);
			subscribeToSNS(snsPriorityTopicARN, queueUrl);
			return loc;
		}
		if (queueType.name().equals(QueueTypeEnum.NOTIFICATION.name())) {
			queueName = env + '-' + locationCode + QueueNameConstant.NOTIFICATION_QUEUE;
			queueUrl = createQueue(queueName);
			loc.setQueueName(QueueTypeEnum.NOTIFICATION.name());
			loc.setQueueUrl(queueUrl);
			return loc;
		}
		if (queueType.name().equals(QueueTypeEnum.FIFO.name())) {
			queueName = env + '-' + locationCode + QueueNameConstant.FIFO_QUEUE;
			queueUrl = createFifoQueue(queueName);
			loc.setQueueName(QueueTypeEnum.FIFO.name());
			loc.setQueueUrl(queueUrl);
			return loc;
		}
		return loc;
	}

	@Override
	public String createQueue(String queueName) {

		Map<String, String> queueAttributes = new HashMap<>();
		queueAttributes.put("MessageRetentionPeriod", "1209600");
		CreateQueueRequest createQueueRequest = new CreateQueueRequest(queueName).withAttributes(queueAttributes);
		CreateQueueResult queueURL = amazonSQSAsync.createQueue(createQueueRequest);
		return queueURL.getQueueUrl();
	}

	@Override
	public String createFifoQueue(String queueName) {

		Map<String, String> queueAttributes = new HashMap<>();
		queueAttributes.put("FifoQueue", "true");
		queueAttributes.put("MessageRetentionPeriod", "1209600");
		CreateQueueRequest createFifoQueueRequest = new CreateQueueRequest(queueName).withAttributes(queueAttributes);
		CreateQueueResult queueURL = amazonSQSAsync.createQueue(createFifoQueueRequest);
		return queueURL.getQueueUrl();
	}

	@Override
	public void subscribeToSNS(String snsTopicARN, String queueUrl) {
		Topics.subscribeQueue(amazonSNSAsync, amazonSQSAsync, snsTopicARN, queueUrl);
	}

	@Override
	public void disableLocationQueue(String location) {

		datasyncAuditService.inActiveLocation(location);
	}
}
