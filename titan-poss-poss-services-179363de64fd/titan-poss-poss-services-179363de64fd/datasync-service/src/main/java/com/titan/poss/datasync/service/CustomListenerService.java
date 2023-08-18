/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.amazonaws.services.sqs.AmazonSQS;
import com.titan.poss.datasync.facade.ConsumeFacade;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class CustomListenerService  {

	@Value("${aws.sqs.profile}")
	private String appLocation;

	@Autowired
	ConsumeFacade consumeFacade;

	@Value("${general.data.queue}")
	private String generalQueue;

	@Value("${env.name}")
	private String env;

	@Value("${cloud.aws.sqs.baseurl}")
	private String queueBaseUrl;

	@Value("${fifo.data.queue}")
	private String fifoQueue;

	@Autowired
	QueueListner queueListner;

//	@Scheduled(fixedDelay = 10, initialDelay = 10000)
	public void queueListner() {
		String generalQueueUrl = queueBaseUrl + env + '-' + appLocation + generalQueue;
		String fifoQueueUrl = queueBaseUrl + env + '-' + appLocation + fifoQueue;
//		try {
//			queueListner.generalQueueListner(generalQueueUrl);
//			queueListner.fifoQueueLister(fifoQueueUrl);
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
		
	}

}
