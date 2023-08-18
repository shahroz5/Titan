/*  
* Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.enums;
/**
 * History Search type enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 *
 **/
public enum HistorySearchTypeEnum {

	MOBILE_NO("MOBILE_NO"), ULP_ID("ULP_ID"), GST_NO("GST_NO"),PAN_NO("PAN_NO"), EMAIL_ID("EMAIL_ID"),CUSTOMER_NAME("CUSTOMER_NAME");
	
	private String value;

	public String getValue() {
		return this.value;

	}

	private HistorySearchTypeEnum(String value) {
		this.value = value;
	}
}
