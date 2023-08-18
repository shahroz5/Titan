/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class FocSchemeAddDto {

	@PatternCheck(regexp = RegExConstants.FOC_SCHEME_NAME_REGEX, nullCheck = true)
	private String name;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_250,nullCheck = true)
	private String description;

	private JsonData grnConfigData;

	private JsonData tepConfigData;

	private JsonData orderConfigData;

	private JsonData clubbingConfigData;

	private Boolean isActive;
	
	private Boolean isAccrualUlp;
}
