/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import lombok.Data;

import javax.validation.Valid;
import java.util.Set;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AddUpdateReportRoleDto {

	private Set<@Valid AddReportRolesDto> addAccess;

	private Set<@Valid UpdateReportRolesDto> updateAccess;

	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeAccess;

}
