/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.enums;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum DestLocationTaxTypeEnum {

	L1("L1"), L2("L2"), L3("L3"), CFA("CFA"), FAC("FAC");

	private String value;

	public String getValue() {
		return this.value;

	}

	private DestLocationTaxTypeEnum(String value) {
		this.value = value;
	}

}
