/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.user.validator.PasswordCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO class for Update Passwrod Details on OTP
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@PasswordCheck
public class OtpPasswordDto extends OtpDto {

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true)
	private String empCode;

	@NotBlank
	private String newPassword;

	@NotNull
	@ValueOfEnum(enumClass = OtpTypeEnum.class)
	private String otpType;
}
