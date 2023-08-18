/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import lombok.Data;

/**
 * DTO for temporary roles
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TempRoleDetails {

	private String roleCode;
	private Short reqValue;
	private Short userLimit;
	private Short assignedUsers;

	public TempRoleDetails(String roleCode, Short reqValue, Short userLimit, Short assignedUsers) {
		super();
		this.roleCode = roleCode;
		this.reqValue = reqValue;
		this.userLimit = userLimit;
		this.assignedUsers = assignedUsers;
	}

}
