/* 
*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.constants;

/**
 * Salutation type enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum SalutationTypeEnum {

	MR("Mr"), MRS("Mrs"), MS("M/S"), DR("Dr");

	private String value;

	public String getValue() {
		return this.value;

	}

	private SalutationTypeEnum(String value) {
		this.value = value;
	}
}
