/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.dto;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ItemStoneDto {

	private String id;

	@NotNull
	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX)
	private String stoneCode;

	private Short noOfStones;

	private Boolean isActive;
	
	//for co
	private String color;
	
	private BigDecimal stoneWeight;
	
	private String quality;
	
	private BigDecimal price;
	
	private String description;
	
	private BigDecimal ratePerCarat;

	private String weightUnit;

	private String currencyCode;

	private String stoneTypeCode;

}
