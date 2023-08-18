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

import org.apache.commons.lang.StringUtils;

import com.titan.poss.sales.dto.request.GRNRequestDto;

/**
 * Validate if one code or email is given
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Documented
@Constraint(validatedBy = ApprovalCodeEmailRoleDateValidation.ValidApprovalFied.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ApprovalCodeEmailRoleDateValidation {

	String message()

	default "Dto validation fails";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class ValidApprovalFied implements ConstraintValidator<ApprovalCodeEmailRoleDateValidation, GRNRequestDto> {

		@Override
		public boolean isValid(GRNRequestDto grnReqDto, ConstraintValidatorContext context) {

			Boolean isValid = true;

			if (StringUtils.isNotBlank(grnReqDto.getApprovalCode()) && grnReqDto.getCcafNo() == null) {

				isValid = false;
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("CCAF no is mandatory if approvalCode is provided.")
						.addConstraintViolation();

			}

			return isValid;
		}
	}
}
