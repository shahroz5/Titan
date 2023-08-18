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

public enum CustomerTypeEnum {

	REGULAR("com.titan.poss.sales.dto.RegularCustomerCreateDto",
			"com.titan.poss.sales.dto.request.RegularCustomerUpdateDto"),
	INTERNATIONAL("com.titan.poss.sales.dto.InternationalCustomerCreateDto",
			"com.titan.poss.sales.dto.request.InternationalCustomerUpdateDto"),
	INSTITUTIONAL("com.titan.poss.sales.dto.InstitutionalCustomerCreateDto",
			"com.titan.poss.sales.dto.request.InstitutionalCustomerUpdateDto"),
	ONETIME("com.titan.poss.sales.dto.OneTimeCustomerDto", "com.titan.poss.sales.dto.OneTimeCustomerDto");

	String classNameForCreate;
	String classNameForUpdate;

	CustomerTypeEnum(String classNameForCreate, String classNameForUpdate) {
		this.classNameForCreate = classNameForCreate;
		this.classNameForUpdate = classNameForUpdate;
	}

	public String getClassNameForCreate() {
		return this.classNameForCreate;
	}

	public String getClassNameForUpdate() {
		return this.classNameForUpdate;
	}
}
