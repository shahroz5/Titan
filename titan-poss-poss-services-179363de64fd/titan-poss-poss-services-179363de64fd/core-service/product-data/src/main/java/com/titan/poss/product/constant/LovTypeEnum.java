/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.constant;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum LovTypeEnum {

	PRODUCTTYPE("Product Type"), REASONTYPE("Reason Type"), PRICINGGROUPTYPE("Pricing Group Type"),
	SUPPLYCHAIN("Supply Chain"), PRICINGTYPE("Pricing Type"), FINDING("Finding"), MATERIALTYPE("Metal Type"),
	GEPITEMTYPE("GEP Item Type"), INDENTTYPE("Indent Type"), PLAINSTUDDEDTYPE("Plain Studded Type"),
	WEIGHT_EDIT_REASON_TYPE("Weight Edit Reason Type"),HALLMARK_KARAT("Hallmarking karat type");

	String lovName;

	LovTypeEnum(String lovName) {
		this.lovName = lovName;
	}

	public String getLovName() {
		return lovName;
	}

}
