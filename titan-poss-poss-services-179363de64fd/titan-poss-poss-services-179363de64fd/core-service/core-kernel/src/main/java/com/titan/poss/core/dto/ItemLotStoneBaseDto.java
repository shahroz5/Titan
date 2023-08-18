/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ItemLotStoneBaseDto {

	private String stoneCode;

	private Short noOfStones;

	private BigDecimal ratePerCarat;

	private BigDecimal stoneWeight;

	private String weightUnit;

	private String currencyCode;

	private String stoneTypeCode;

	private String stoneQuality;

}
