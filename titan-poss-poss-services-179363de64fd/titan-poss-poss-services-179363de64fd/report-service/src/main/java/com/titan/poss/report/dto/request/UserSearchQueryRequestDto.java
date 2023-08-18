/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class UserSearchQueryRequestDto {

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true)
	private String employeeCode;

	@NotNull(message = "saved query cannot be null")
	private JsonData savedQuery;

	//@PatternCheck(regexp = RegExConstants.QUERY_NAME_REGEX, nullCheck = true)
	private String queryName;

}
