/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for Employee Details of list employees details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EmployeeListDto extends BaseEmployeeResponseDto {
	private String primaryRoleCode;
	private String primaryRoleName;

	// if in one field they are taking all locCode, regCode, orgCode. Send in one field, in that way param will be 11 -> 8
	public EmployeeListDto(String employeeCode, String empName, String locationCode,
			String userType, Boolean isLoginActive, Boolean isLocked, Boolean isActive, String employeeType, String primaryRoleCode, String primaryRoleName, String mobileNo) {
		super(employeeCode, empName, locationCode, userType, isLoginActive, isLocked, isActive, employeeType, mobileNo);
		this.primaryRoleCode = primaryRoleCode;
		this.primaryRoleName = primaryRoleName;
	}
}
