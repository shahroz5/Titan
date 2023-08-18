/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

import java.math.RoundingMode;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class DomainConstants {

	public static final int WEIGHT_SCALE = 3;
	public static final int PRICE_SCALE = 2;
	public static final int MAX_NO_OF_DIGIT = 15;

	public static final String ASIAN_PRICE_TYPE = "ASIAN";

	public static final RoundingMode ROUNDIND_MODE = RoundingMode.HALF_UP;
}
