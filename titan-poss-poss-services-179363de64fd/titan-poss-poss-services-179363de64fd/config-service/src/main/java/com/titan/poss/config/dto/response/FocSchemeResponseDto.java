/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class FocSchemeResponseDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;

	private String name;

	private String description;

	private JsonData grnConfig;

	private JsonData tepConfig;

	private JsonData orderConfig;

	private JsonData clubbingConfig;

	private Boolean isActive;
	
	private Boolean isAccrualUlp;

}
