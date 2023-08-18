/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountItemsDto {

	private Date mfgDate;
	private Date stockInwardDate;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String itemId;

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX, nullCheck = false)
	private String lotNumber;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX, nullCheck = false)
	private String productGroupCode;

	@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX, nullCheck = false)
	private String productCategoryCode;

	private String applicableKaratageType;
	
	private BigDecimal makingChargePerGram;

	private BigDecimal complexityPercent;

}
