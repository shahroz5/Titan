/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;

import java.util.Set;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class UpdateReportFieldsRoleDto {

	private Set<@Valid AddRolesDto> addRoles;
	
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeRoles;
}
