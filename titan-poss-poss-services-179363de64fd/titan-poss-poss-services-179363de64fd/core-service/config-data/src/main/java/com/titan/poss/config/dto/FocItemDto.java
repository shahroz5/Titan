/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class to list the EligibleFocItems in a FOC scheme of cash memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocItemDto {

	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Weight valid till {integer} digits and {fraction} decimal places")
	private BigDecimal weight;

	private Short quantity;

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

}
