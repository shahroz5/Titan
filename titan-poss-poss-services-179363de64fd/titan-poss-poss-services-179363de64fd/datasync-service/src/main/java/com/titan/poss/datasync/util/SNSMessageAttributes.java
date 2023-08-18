/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.model.MessageAttributeValue;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class SNSMessageAttributes {

	private String message;
	private Map<String, MessageAttributeValue> messageAttributes;

	public SNSMessageAttributes(final String message) {
		this.message = message;
		messageAttributes = new HashMap<>();
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(final String message) {
		this.message = message;
	}

	public void addAttribute(final String attributeName, final String attributeValue) {
		final MessageAttributeValue messageAttributeValue = new MessageAttributeValue().withDataType("String")
				.withStringValue(attributeValue);
		messageAttributes.put(attributeName, messageAttributeValue);
	}

	public void addAttribute(final String attributeName, final List<?> attributeValues) {
		String valuesString;
		String delimiter = ", ";
		String prefix = "[";
		String suffix = "]";
		if (attributeValues.get(0).getClass() == String.class) {
			delimiter = "\", \"";
			prefix = "[\"";
			suffix = "\"]";
		}
		valuesString = attributeValues.stream().map(Object::toString)
				.collect(Collectors.joining(delimiter, prefix, suffix));
		final MessageAttributeValue messageAttributeValue = new MessageAttributeValue().withDataType("String.Array")
				.withStringValue(valuesString);
		messageAttributes.put(attributeName, messageAttributeValue);
	}

	public void addAttribute(final String attributeName, final Number attributeValue) {
		final MessageAttributeValue messageAttributeValue = new MessageAttributeValue().withDataType("Number")
				.withStringValue(attributeValue.toString());
		messageAttributes.put(attributeName, messageAttributeValue);
	}

	public String publish(final AmazonSNS snsClient, final String topicArn) {
		final PublishRequest request = new PublishRequest(topicArn, message).withMessageAttributes(messageAttributes);
		final PublishResult result = snsClient.publish(request);
		return result.getMessageId();
	}
}