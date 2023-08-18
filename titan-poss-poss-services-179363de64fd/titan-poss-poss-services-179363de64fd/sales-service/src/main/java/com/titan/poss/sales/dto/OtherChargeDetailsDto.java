/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseDtoFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO class for other charge details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class OtherChargeDetailsDto extends BaseDtoFieldsValidator {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_100, message = "Please provide other charge type", nullCheck = true)
	private String type;

	@Valid
	private OtherChargesDto data;

}
