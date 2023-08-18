/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant.enums;

/**
 * Customer type enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum ContentTypesEnum {

	// @formatter:off
	
	// Text
	TXT("text/plain"), CSV("text/csv"),EVENT_STREAM("text/event-stream"),
	// Application
	JSON("application/json"), XML("application/xml"), PDF("application/pdf"), OCTET_STREAM("application/octet-stream");
	
	// @formatter:on

	private String value;

	public String getValue() {
		return this.value;

	}

	private ContentTypesEnum(String value) {
		this.value = value;
	}
}
