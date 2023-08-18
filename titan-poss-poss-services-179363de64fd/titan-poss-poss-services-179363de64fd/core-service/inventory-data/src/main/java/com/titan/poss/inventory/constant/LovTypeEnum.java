/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.constant;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum LovTypeEnum {

	DEFECTCODE("Defect Code"),DEFECTTYPE("Defect Type");

	String lovName;

	LovTypeEnum(String lovName) {
		this.lovName = lovName;
	}

	public String getLovName() {
		return lovName;
	}

}
