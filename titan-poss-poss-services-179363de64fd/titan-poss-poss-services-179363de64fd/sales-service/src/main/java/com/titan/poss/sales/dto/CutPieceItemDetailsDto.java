/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CutPieceItemDetailsDto extends BaseFieldsValidator {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX, nullCheck = true)
	private String lotNumber;

	@NotNull(message = "grossWeight cannot be null")
	@Positive(message = "grossWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "grossWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal grossWeight;

	@NotNull(message = "metalWeight cannot be null")
	private JsonData metalWeight;

}
