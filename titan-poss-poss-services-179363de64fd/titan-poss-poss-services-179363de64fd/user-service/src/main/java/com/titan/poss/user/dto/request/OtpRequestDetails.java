/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.user.validator.CheckContactDetailsPattern;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for verifying OTP
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@CheckContactDetailsPattern
@EqualsAndHashCode(callSuper = true)
public class OtpRequestDetails extends BaseOtpDetails {

	@NotNull
	@ValueOfEnum(enumClass = OtpTypeEnum.class)
	private String otpType;

	@Size(max = 20, message = "Maximun value of Requested value is {max}")
	private String requestedValue;
}
