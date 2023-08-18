/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.validator;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.CONSTRUCTOR;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE_USE;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Date;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import com.titan.poss.core.utils.CalendarUtils;

/**
 * Validates if regular expression passes
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Documented
@Constraint(validatedBy = DateFormat.DateFormatValidator.class)
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RetentionPolicy.RUNTIME)
public @interface DateFormat {
	String message() default "Invalid DateFormat value";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class DateFormatValidator implements ConstraintValidator<DateFormat, String> {

		private String message;

		@Override
		public void initialize(DateFormat dateFormat) {
			this.message = dateFormat.message();
		}

		@Override
		public boolean isValid(String value, ConstraintValidatorContext context) {
			Boolean isValid = true;
			if (value == null)
				return isValid;
			try {
				CalendarUtils.formatDateToString(new Date(), value);
			} catch (Exception e) {
				isValid = false;
			}
			if (!isValid) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
			}
			return isValid;
		}
	}
}
