/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

import javax.validation.constraints.Past;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.user.validator.ExpiryTimeConstraint;
import com.titan.poss.user.validator.RoleUniqueConstraintsInUpdate;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
/**
 * DTO class for base update an employee details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@ExpiryTimeConstraint
@RoleUniqueConstraintsInUpdate
public abstract class BaseUpdateUserDto {

	@Size(max = 100, message = "Email Id max length is {max}")
	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX, message = "Invalid email format")
	private String emailId;

	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX)
	private String mobileNo;

	@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX)
	private String primaryRoleCode;

	@Size(min = 2, max = 40)
	@PatternCheck(regexp = RegExConstants.USER_NAME_REGEX)
	private String empName;

	private JsonData address;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date joiningDate;

	@Past
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date birthDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date resignationDate;

	private Boolean isLoginActive;

	private Set<@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String> addTempRoleCodes = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

	private Set<@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String> removeTempRoleCodes = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date expiryDate;

	@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX)
	private String updateTempRoleCode;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date updateTempStartTime;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date updateTempExpiryTime;

}
