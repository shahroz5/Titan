/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.constants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum TaxSystemEnum {

	VAT("Value Added Tax"), GST("Goods and Services Tax"), CESS("CESS Tax");

	private String value;

	public String getValue() {
		return this.value;
	}

	TaxSystemEnum(String value) {
		this.value = value;
	}

}
