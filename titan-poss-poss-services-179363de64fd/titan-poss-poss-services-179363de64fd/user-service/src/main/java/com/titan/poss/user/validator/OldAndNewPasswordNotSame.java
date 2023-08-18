/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
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

import com.titan.poss.user.dto.request.ResetPasswordDto;

/**
 * Validates if 'old password' and 'new password' provided are not same
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = OldAndNewPasswordNotSame.CheckOldAndNewPassword.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface OldAndNewPasswordNotSame {

	String message()

	default "Old Password and new password can't be same";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class CheckOldAndNewPassword implements ConstraintValidator<OldAndNewPasswordNotSame, ResetPasswordDto> {

		@Override
		public boolean isValid(ResetPasswordDto resetPasswordDto, ConstraintValidatorContext context) {
			Boolean isValid = true;
			if (resetPasswordDto.getOldPassword().equals(resetPasswordDto.getNewPassword())) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("Old Password and new password can't be same")
						.addConstraintViolation();
				isValid = false;
			}
			return isValid;
		}
	}

}
