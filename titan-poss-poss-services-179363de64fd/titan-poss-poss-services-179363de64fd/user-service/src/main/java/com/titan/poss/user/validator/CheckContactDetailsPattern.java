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

import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.user.dto.request.OtpRequestDetails;

/**
 * Validates OTP requested value based on type provided
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = CheckContactDetailsPattern.VerifyMobileAndEmailPattern.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckContactDetailsPattern {

	String message()

	default "Contact details provided is not matching pattern";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class VerifyMobileAndEmailPattern
			implements ConstraintValidator<CheckContactDetailsPattern, OtpRequestDetails> {

		private boolean isValidString(String req, String pattern) {
			if (req == null)
				return false;
			return req.matches(pattern);
		}

		@Override
		public boolean isValid(OtpRequestDetails otpRequestDetails, ConstraintValidatorContext context) {
			Boolean isValid = true;

			if (OtpTypeEnum.MOBILENO_CHANGE.name().equalsIgnoreCase(otpRequestDetails.getOtpType())) {
				isValid = checkValidContact(otpRequestDetails, context, RegExConstants.MOBILE_REGEX, isValid,
						"Wrong mobile no format");
			}
			return isValid;
		}

		private Boolean checkValidContact(OtpRequestDetails otpRequestDetails, ConstraintValidatorContext context,
				String regex, Boolean isValid, String errorDetails) {
			if (!isValidString(otpRequestDetails.getRequestedValue(), regex)) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(errorDetails).addConstraintViolation();
				isValid = false;
			}
			return isValid;
		}
	}

}
