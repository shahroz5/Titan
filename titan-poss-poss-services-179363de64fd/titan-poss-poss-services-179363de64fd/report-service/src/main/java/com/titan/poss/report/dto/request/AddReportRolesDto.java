/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AddReportRolesDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String reportId;

	@PatternCheck(regexp = RegExConstants.ACCESS_TIME_REGEX, nullCheck = true)
	private String fromAccessTime;

	@PatternCheck(regexp = RegExConstants.ACCESS_TIME_REGEX, nullCheck = true)
	private String toAccessTime;
}
