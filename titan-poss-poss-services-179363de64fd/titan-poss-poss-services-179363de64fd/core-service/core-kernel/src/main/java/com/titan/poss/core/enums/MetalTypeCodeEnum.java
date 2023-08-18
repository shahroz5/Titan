/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum MetalTypeCodeEnum {

	L("L", "Platinum"), P("P", "Silver"), O("O", "Others"), J("J", "Gold"), LJ("LJ", "BiMetal"), S("S", "Diamond"),
	F2("F1", "F1"), F1("F2", "F2");
	String code;
	String value;

	MetalTypeCodeEnum(String code, String value) {
		this.code = code;
		this.value = value;
	}

	public static List<String> getUniqueMetals() {
		List<String> uniqueMetals = new ArrayList<>();
		uniqueMetals.add(L.toString());
		uniqueMetals.add(P.toString());
		uniqueMetals.add(J.toString());
		return uniqueMetals;
	}

	public String getCode() {
		return this.code;
	}

	public String getValue() {
		return this.value;
	}
	// J-GOLD
	// P-SILVER
	// L-PLATINUM
	// S-STONES
}
