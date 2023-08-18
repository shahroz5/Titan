/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Map;

import javax.validation.constraints.NotEmpty;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class TaxCalculationResponseDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide Tax Type")
	private String taxType;

	@PatternCheck(regexp = RegExConstants.TAX_CLASS_CODE_REGEX, message = "Please provide Tax Class")
	private String taxClass;

	@NotEmpty
	private Map<String, TaxDetailDto> data;

	private Map<String, CessDetailDto> cess;

}
