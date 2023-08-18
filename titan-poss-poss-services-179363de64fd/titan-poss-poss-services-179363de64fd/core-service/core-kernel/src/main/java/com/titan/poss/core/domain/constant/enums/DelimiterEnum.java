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

public enum DelimiterEnum {
	CSV(","), PSV("|");

	private String value;

	public String getValue() {
		return this.value;

	}

	private DelimiterEnum(String value) {
		this.value = value;
	}

}
