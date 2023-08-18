/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AddRolesDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String reportFieldId;

	@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX)
	private String roleCode;

	@NotNull(message = "is excluded cannot be null")
	private Boolean isExcluded;

	@NotNull(message = "is masked cannot be null")
	private Boolean isMasked;

}
