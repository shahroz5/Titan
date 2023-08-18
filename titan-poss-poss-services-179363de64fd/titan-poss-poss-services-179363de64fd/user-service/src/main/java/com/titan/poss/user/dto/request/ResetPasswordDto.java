/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import javax.validation.constraints.NotBlank;

import com.titan.poss.user.validator.OldAndNewPasswordNotSame;

import lombok.Data;

/**
 * DTO class for Update Password Details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@OldAndNewPasswordNotSame
public class ResetPasswordDto {

	@NotBlank
	private String oldPassword;

	@NotBlank
	private String newPassword;
}
