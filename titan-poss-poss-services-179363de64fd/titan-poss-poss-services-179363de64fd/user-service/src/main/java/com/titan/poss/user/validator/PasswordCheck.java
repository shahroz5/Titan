/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.apache.commons.lang.StringUtils;

import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.user.dto.request.OtpPasswordDto;

/**
 * Validates OtpPasswordDto for password is required or not
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = PasswordCheck.VerifyPassword.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordCheck {
	String message()

	default "Password is required for provided OTP type";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class VerifyPassword implements ConstraintValidator<PasswordCheck, OtpPasswordDto> {

		@Override
		public boolean isValid(OtpPasswordDto otpPassword, ConstraintValidatorContext context) {
			Boolean isValid = true;
			OtpTypeEnum providedOtpType = OtpTypeEnum.valueOf(otpPassword.getOtpType().toUpperCase());
			if ((providedOtpType == OtpTypeEnum.INVITED || providedOtpType == OtpTypeEnum.LOGIN_ACTIVATED
					|| providedOtpType == OtpTypeEnum.FORGOT_PASSWORD)
					&& StringUtils.isBlank(otpPassword.getNewPassword())) {
				isValid = false;
			}
			return isValid;
		}

	}

}
