/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.util;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class SQSmessageBody {

	@JsonProperty(value = "Type")
	private String type = "Notification";

	@JsonProperty(value = "Message")
	private String message;

	@JsonProperty(value = "MessageAttributes")
	private MessageAttributes messageAttributes = new MessageAttributes();

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public MessageAttributes getMessageAttributes() {
		return messageAttributes;
	}

	public void setMessageAttributes(MessageAttributes messageAttributes) {
		this.messageAttributes = messageAttributes;
	}

}
