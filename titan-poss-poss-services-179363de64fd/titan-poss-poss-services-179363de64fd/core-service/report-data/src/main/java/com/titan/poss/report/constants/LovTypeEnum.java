/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.constants;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum LovTypeEnum {

	STOCK_ISSUE_REPORT_HEADER("Stock Issue Report Header");

	String lovName;

	LovTypeEnum(String lovName) {
		this.lovName = lovName;
	}

	public String getLovName() {
		return lovName;
	}

}
