/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.titan.poss.user.dto.request.LocationFormatRoleLimitDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for role Details of a role
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RoleDto extends BaseRoleResponseDto {
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private List<AclDto> aclCodes;

	private Set<LocationFormatRoleLimitDto> roleToLocationFormats;
	
	

	public RoleDto(String roleCode, String roleName, String description, Boolean isActive, Short userLimit,
			Short assignedUsers, Boolean corpAccess) {
		super(roleCode, roleName, description, isActive, userLimit, assignedUsers, corpAccess);
		this.aclCodes = null;
		this.roleToLocationFormats = null;
	}
	private Boolean isLocationMappingRequired;
	private String accessType;
}
