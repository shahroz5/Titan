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

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSAsync;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.util.SNSMessageAttributes;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SNSService {

	@Value("${cloud.aws.sns.general.arn}")
	private String snsGeneralTopicARN;

	@Value("${cloud.aws.sns.priority.arn}")
	private String snsPriorityTopicARN;

	@Autowired
	AmazonSNS amazonSNSAsync;

	private static final Logger LOGGER = LoggerFactory.getLogger(SNSService.class);

//	@Async
	public Future<String> sendToSNS(MessageTransfer messageTransfer) {

		String snsTopicARN = snsGeneralTopicARN;
		String messageId = "";
		if (messageTransfer.getMessageType().equals(MessageType.PRIORITY.name())) {
			snsTopicARN = snsPriorityTopicARN;
		}

		String message = MapperUtil.getStringFromJson(messageTransfer);

		SNSMessageAttributes sa = new SNSMessageAttributes(message);
		sa.addAttribute("contentType", ContentTypesEnum.JSON.getValue());

		try {
			messageId = (sa.publish(amazonSNSAsync, snsTopicARN));

		} catch (AmazonServiceException ase) {
			LOGGER.warn("Amazon Service Exception", ase);
		} catch (AmazonClientException ace) {
			LOGGER.warn("Amazon Client Exception", ace);
		}
		return new AsyncResult<>(messageId);
	}

}
