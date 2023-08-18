/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.store.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO to update customer town.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CustomerTownUpdateDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String stateCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_100)
	private String description;

	private Boolean isActive;
}
