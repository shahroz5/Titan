/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.util.StringUtils;

import com.titan.poss.sales.dto.request.ConfirmCancelDto;

/**
 * Checks if remarks is present or not for cancel. (for cancel without request)
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = RemarksCheckForBillCancelWORequest.VerifyRemarks.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface RemarksCheckForBillCancelWORequest {
//	ConfirmCancelDto

	String message() default "Remarks is mandatory";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class VerifyRemarks implements ConstraintValidator<RemarksCheckForBillCancelWORequest, ConfirmCancelDto> {

		@Override
		public boolean isValid(ConfirmCancelDto confirmCancelDto, ConstraintValidatorContext context) {
			// check if remarks is present
			// if remarks is empty then not valid(false), else valid (true)
			return !StringUtils.isEmpty(confirmCancelDto.getRemarks());
		}

	}
}
