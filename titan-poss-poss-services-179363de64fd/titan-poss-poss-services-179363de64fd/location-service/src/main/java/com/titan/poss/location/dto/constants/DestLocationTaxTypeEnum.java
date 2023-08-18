/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.constants;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum DestLocationTaxTypeEnum {

	L1("Level 1"), L2("Level 2"), L3("Level 3"), CFA("CFA"), FACTORY("Factory");

	private String value;

	public String getValue() {
		return this.value;

	}

	private DestLocationTaxTypeEnum(String value) {
		this.value = value;
	}

}
