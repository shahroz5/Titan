/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.constants;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum CustomerTaxTypeEnum {

	NONREGISTERED("NonRegistered"), REGISTERED("Registered");

	private String value;

	public String getValue() {
		return this.value;

	}

	private CustomerTaxTypeEnum(String value) {
		this.value = value;
	}

}
