/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.constant;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum ProductCategoryEnum {

	SET_PRODUCT_2("2", "SetProduct2"), SET_PRODUCT_3("3", "SetProduct3"), SET_PRODUCT_4("4", "SetProduct4"),
	SET_PRODUCT_5("5", "SetProduct5"), SET_PRODUCT_8("8", "N+E+TIKKA+F"), BANGLES("V", "BANGLES");

	private String value;
	private String code;

	public String getValue() {
		return this.value;
	}

	public String getCode() {
		return this.code;
	}

	private ProductCategoryEnum(String code, String value) {
		this.code = code;
		this.value = value;
	}

}
