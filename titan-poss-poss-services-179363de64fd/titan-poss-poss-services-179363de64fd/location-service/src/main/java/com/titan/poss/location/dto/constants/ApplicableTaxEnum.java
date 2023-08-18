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

public enum ApplicableTaxEnum {
	SGST_UTGST_CGST("SGST/UTGST,CGST"), IGST("IGST"), NA("NA") ;
	
	private String value;
	
	public String getValue() {
		return this.value;

	}

	private ApplicableTaxEnum(String value) {
		this.value = value;
	}
}
