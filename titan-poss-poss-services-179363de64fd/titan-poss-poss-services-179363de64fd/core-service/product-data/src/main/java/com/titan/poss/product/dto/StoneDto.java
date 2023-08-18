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
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StoneDto {

	@NotNull(message = "Please provide the stoneCode")
	@PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX)
	private String stoneCode;

	@NotNull
	private String color;

	@NotNull(message = "Please provide the stdWeight")
	private BigDecimal stdWeight;

	@NotNull(message = "Please provide the stoneTypeCode")
	@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX)
	private String stoneTypeCode;

	@NotNull(message = "Please provide the quality")
	@PatternCheck(regexp = RegExConstants.STONE_QUALITY_REGEX)
	private String quality;

	@PatternCheck(regexp = RegExConstants.STONE_SHAPE_REGEX)
	private String shape;

	@NotNull(message = "Please provide the stdValue")
	private BigDecimal stdValue;

	@NotNull
	private BigDecimal ratePerCarat;

	private Boolean isActive;

	@PatternCheck(regexp = RegExConstants.CURRENCY_CODE_REGEX)
	private String currencyCode;

	private String weightUnit;

}
