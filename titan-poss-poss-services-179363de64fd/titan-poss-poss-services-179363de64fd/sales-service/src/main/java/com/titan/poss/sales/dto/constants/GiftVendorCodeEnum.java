/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum GiftVendorCodeEnum {

	QC_GC("QCGC");

	private String value;

	public String getValue() {
		return this.value;
	}

	private GiftVendorCodeEnum(String value) {
		this.value = value;
	}
}
