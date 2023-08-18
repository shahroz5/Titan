/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.store.dto.request;

import javax.validation.constraints.NotBlank;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO to add customer town.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CustomerTownAddDto {

	@NotBlank
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_100, nullCheck = true)
	private String description;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String stateCode;

	private Boolean isActive;
}
