/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for role Details of a role
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class RoleListDto extends BaseRoleResponseDto {

	public RoleListDto(String roleCode, String roleName, String description, Boolean isActive, Boolean corpAccess) {
		super(roleCode, roleName, description, isActive, null, null, corpAccess);
	}

	public RoleListDto(String roleCode, String roleName, String description, Boolean isActive, Short userLimit,
			Short assignedUsers, Boolean corpAccess) {
		super(roleCode, roleName, description, isActive, userLimit, assignedUsers, corpAccess);
	}
	
	private Boolean isLocationMappingRequired;
	public RoleListDto(String roleCode, String roleName, String description, Boolean isActive, Boolean corpAccess,Boolean isLocationMappingRequired) {
		super(roleCode, roleName, description, isActive, null, null, corpAccess);
		this.isLocationMappingRequired=isLocationMappingRequired;
	}
}
