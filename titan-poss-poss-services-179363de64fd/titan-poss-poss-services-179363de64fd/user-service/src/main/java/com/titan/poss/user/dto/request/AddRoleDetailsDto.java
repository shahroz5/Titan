/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import java.util.Set;
import java.util.TreeSet;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.user.validator.RoleToLocationFormatCheck;

import lombok.Data;

/**
 * DTO class for add a role
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@RoleToLocationFormatCheck
public class AddRoleDetailsDto {

	@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = true)
	private String roleCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true)
	private String roleName;

	@PatternCheck(regexp = RegExConstants.ROLE_DESCRIPTION_REGEX_MAX_100, nullCheck = true)
	private String description;

	@PatternCheck(regexp = RegExConstants.ACCESS_TYPE_REGEX, nullCheck = true)
	private String accessType;

	@NotNull
	private Boolean corpAccess;

	private Set<@PatternCheck(regexp = RegExConstants.ACL_REGEX, nullCheck = false) String> addAclCodes = new TreeSet<>(
			String.CASE_INSENSITIVE_ORDER);

	@Valid
	private Set<LocationFormatRoleLimitDto> addRoleToLocationFormats;
	
	@NotNull
	private Boolean isLocationMappingRequired;
}
