/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.util;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class ContentType {

	@JsonProperty(value = "Type")
	private String type = "String";

	@JsonProperty(value = "Value")
	private String value = ContentTypesEnum.JSON.getValue();

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

}
