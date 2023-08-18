/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.constants;

import java.util.List;

import com.titan.poss.core.enums.PlainStuddedEnum;

/**
 * ENUM for allowed product types in GRF/GRF CN.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum AllowedCategoryForCN {

	PLAIN, STUDDED;

	public static List<String> getAllowedCategory() {
		return List.of(PLAIN.name(), STUDDED.name());
	}

	public static String getShortPrcingType(AllowedCategoryForCN allowedCategory) {
		if (allowedCategory.equals(PLAIN)) {
			return PlainStuddedEnum.P.name();
		}
		if (allowedCategory.equals(STUDDED)) {
			return PlainStuddedEnum.S.name();
		}
		return null;
	}
}
