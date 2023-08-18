/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class ItemSearchRequestDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;

	@PositiveOrZero(message = "from std value should be more than 0")
	private BigDecimal fromStdValue;

	@PositiveOrZero(message = "to std value should be more than 0")
	private BigDecimal toStdValue;

	@PositiveOrZero(message = "from stone charges should be more than 0")
	private BigDecimal fromStoneCharges;

	@PositiveOrZero(message = "to stone charges should be more than 0")
	private BigDecimal toStoneCharges;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX)
	private String productGroupCode;

	@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX)
	private String productCategoryCode;

	@PositiveOrZero(message = "from std weight should be more than 0")
	private BigDecimal fromStdWeight;

	@PositiveOrZero(message = "from to weight should be more than 0")
	private BigDecimal toStdWeight;

	@PatternCheck(regexp = RegExConstants.PRICING_TYPE)
	private String pricingType;
	


}
