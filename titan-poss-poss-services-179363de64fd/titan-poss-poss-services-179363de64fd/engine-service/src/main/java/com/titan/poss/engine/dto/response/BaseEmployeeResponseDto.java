/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
* DTO for Base employee details
* 
* @author Mindtree Ltd.
* @version 1.0
*/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseEmployeeResponseDto {
	private String employeeCode;
	private String empName;
	private String locationCode;
	private String userType;
	@JsonProperty(value = "isLoginActive")
	private Boolean isLoginActive;
	@JsonProperty(value = "isLocked")
	private Boolean isLocked;
	@JsonProperty(value = "isActive")
	private Boolean isActive;
	private String employeeType;
	private String mobileNo;

}
