/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
* DTO for Base role details
* 
* @author Mindtree Ltd.
* @version 1.0
*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseRoleResponseDto {
	private String roleCode;
	private String roleName;
	private String description;
	private Boolean isActive;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Short userLimit;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Short assignedUsers;
	private Boolean corpAccess;
	

}
