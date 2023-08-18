/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import java.util.Set;
import java.util.TreeSet;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.user.validator.AclUniqueConstraint;

import lombok.Data;

/**
 * DTO class for Update Role Details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AclUniqueConstraint
public class UpdateRolesDetailDto {

	//will accept spaces
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_100, nullCheck = false)
	private String description;

	//will accept spaces
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = false)
	private String roleName;

	private Boolean isActive;

	private Set<@PatternCheck(regexp = RegExConstants.ACL_REGEX, nullCheck = false) String> addAclCodes = new TreeSet<>(
			String.CASE_INSENSITIVE_ORDER);

	private Set<@PatternCheck(regexp = RegExConstants.ACL_REGEX, nullCheck = false) String> removeAclCodes = new TreeSet<>(
			String.CASE_INSENSITIVE_ORDER);
	
	@PatternCheck(regexp = RegExConstants.ACCESS_TYPE_REGEX, nullCheck = false)
	private String accessType;

	
	private Boolean corpAccess;

	@Valid
	private Set<LocationFormatRoleLimitDto> addRoleToLocationFormats;

}
