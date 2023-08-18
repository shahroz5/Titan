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
public class PriceDto {

	private String id;

	@NotNull
	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;

	@NotNull
	@PatternCheck(regexp = RegExConstants.PRICE_GROUP_REGEX)
	private String priceGroup;

	private BigDecimal makingCharge;

	private Boolean isActive;

}
