/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.constants;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum LovTypeEnum {

	LOCATIONTYPE("Location Type"), OWNERTYPE("Owner Type"), LOCATIONFORMAT("Location Format"), TAXSYSTEM("Tax System"),
	MATERIALPRICETYPE("Material Price Type"), DATEFORMAT("Date Format"), TIMEFORMAT("Time Format"),
	TAXTRANSACTIONTYPE("Tax Transaction Type"), PRINT_DOC_TYPE("Print Doc Type"),TEPPARTIALCNCANCELLATION("Tep Partial CN Cancellation");

	String lovName;

	LovTypeEnum(String lovName) {
		this.lovName = lovName;
	}

	public String getLovName() {
		return lovName;
	}

}
