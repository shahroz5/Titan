/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.engine.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO for role Details of a role
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
public class UserRoleDto {
	private String roleCode;
	private String roleName;
	private String description;
	private Boolean isPrimary;
	private Date startDate;
	private Date expiryDate;
	private Boolean corpAccess;

}
