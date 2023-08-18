/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class KeyValueDto {

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_SPACE_REGEX_50)
	private String code;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_SPACE_REGEX_50)
	private String value;

	@NotNull(message = "Please provide the isActive")
	private Boolean isActive;

}
