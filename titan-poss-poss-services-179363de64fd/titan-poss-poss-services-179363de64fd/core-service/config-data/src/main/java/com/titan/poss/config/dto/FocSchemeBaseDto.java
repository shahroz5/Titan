/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class FocSchemeBaseDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;

	private String name;

	private String description;

	private Boolean isActive;

}
