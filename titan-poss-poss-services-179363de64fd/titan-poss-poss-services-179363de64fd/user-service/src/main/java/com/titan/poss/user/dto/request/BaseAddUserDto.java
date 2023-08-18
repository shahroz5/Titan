/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import java.util.Date;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;
import java.util.Set;
import java.util.TreeSet;
import com.titan.poss.user.validator.ExpiryTimeConstraint;
import com.titan.poss.user.validator.RoleUniqueConstraintsInAdd;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * DTO class for base add employee details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@ExpiryTimeConstraint
@RoleUniqueConstraintsInAdd
public abstract class BaseAddUserDto {

	@Size(min = 2, max = 40, message = "Employee name min length is {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.USER_NAME_REGEX, nullCheck = true)
	private String empName;

	@NotNull
	@Valid
	private JsonData address;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date joiningDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date resignationDate;

	@Past
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date birthDate;

	@Size(max = 100, message = "Email Id max length is {max}")
	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX, message = "Invalid email format", nullCheck = false)
	private String emailId;

	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX, nullCheck = true)
	private String mobileNo;

	@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = true)
	private String primaryRoleCode;

	@NotNull
	private Boolean isLoginActive;
	

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true)
	private String employeeCode;

	private Set<@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = false) String> tempRoleCodes = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date expiryDate;


}
