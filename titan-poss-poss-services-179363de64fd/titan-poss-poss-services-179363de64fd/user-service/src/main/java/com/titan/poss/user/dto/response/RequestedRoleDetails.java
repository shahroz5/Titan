/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Location Details of a location
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestedRoleDetails {

	private String id;
	private String roleCode;
	private String roleName;
	private Short assignedUsers;
	private Short userLimit;
	private Short reqValue;

}
