/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import java.util.Date;
import java.util.Set;

import lombok.Data;
import lombok.EqualsAndHashCode;

/*
* DTO for an employee details
* 
* @author Mindtree Ltd.
* @version 1.0
*/
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeeDto extends BaseEmployeeResponseDto {
	private Object address;
	private Date joiningDate;
	private Date resignationDate;
	private Date birthDate;
	private String emailId;
	private Boolean hasLoginAccess;
	private Boolean forcePasswordChange;
	private Set<UserRoleDto> roles;
	private String regionCode;
	private String orgCode;
	private String requestedMobileNo;
}
