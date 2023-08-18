/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.math.BigDecimal;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StoneUpdateDto {

	private String color;

	private BigDecimal stdWeight;

	@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX)
	private String stoneTypeCode;

	@PatternCheck(regexp = RegExConstants.STONE_QUALITY_REGEX)
	private String quality;

	@PatternCheck(regexp = RegExConstants.STONE_SHAPE_REGEX)
	private String shape;

	private BigDecimal stdValue;

	private BigDecimal ratePerCarat;

	private Boolean isActive;

	@PatternCheck(regexp = RegExConstants.CURRENCY_CODE_REGEX)
	private String currencyCode;

	private String weightUnit;

}
