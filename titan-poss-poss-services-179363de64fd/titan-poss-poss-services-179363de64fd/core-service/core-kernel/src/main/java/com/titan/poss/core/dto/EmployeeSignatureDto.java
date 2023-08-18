package com.titan.poss.core.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeSignatureDto {
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
	private String userName;
	private Object address;
	private String emailId;
	private Boolean hasLoginAccess;
	private Boolean forcePasswordChange;
	private String regionCode;
	private String orgCode;
	private String digitalSignature;
}
