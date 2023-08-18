/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class LotDetailsPriceDto {

	Short noOfStones;
	String stoneCode;
	BigDecimal stoneWeight;
}
