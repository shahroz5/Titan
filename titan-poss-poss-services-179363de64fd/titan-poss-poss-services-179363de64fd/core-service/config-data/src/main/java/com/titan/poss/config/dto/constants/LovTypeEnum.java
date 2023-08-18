/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.constants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum LovTypeEnum {

	DISCOUNT_TYPE("Discount Type"), RANGE_TYPE("Range Type"), CLUBBING_DISCOUNT_TYPE("Clubbing Discount Type"),
	APPROVAL_ROLES("Approval Roles"), RIVAAH_CARD("Rivaah Card");

	String lovName;

	LovTypeEnum(String lovName) {
		this.lovName = lovName;
	}

	public String getLovName() {
		return lovName;
	}

}
