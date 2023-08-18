/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.validator;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.CONSTRUCTOR;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE_USE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Validates if provided user limit is with in the given range.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = UserLimitCheck.UserLimitValidCheck.class)
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
@Component
public @interface UserLimitCheck {

	String message() default "User limit not in range!";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
	@Retention(RUNTIME)
	@Documented
	@interface List {

		UserLimitCheck[] value();
	}

	@Component
	public class UserLimitValidCheck implements ConstraintValidator<UserLimitCheck, Short> {

		Short maxUserLimit;

		@Value("${poss.user.maxUserLimit:999}")
		public void setMaxUserLimit(Short maxUserLimit) {
			this.maxUserLimit = maxUserLimit;
		}

		protected String message;

		@Override
		public void initialize(UserLimitCheck userLimitCheck) {
			// PENDING TASK not taking from env file
			if (userLimitCheck == null)
				maxUserLimit = 999;
			this.message = "  Range of user limit for the role: 0 - " + maxUserLimit;
		}

		@Override
		public boolean isValid(Short value, ConstraintValidatorContext context) {
			Boolean isValid = true;
			if (value == null || value < 0 || value > maxUserLimit) {
				isValid = false;
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
			}
			return isValid;
		}

	}
}
