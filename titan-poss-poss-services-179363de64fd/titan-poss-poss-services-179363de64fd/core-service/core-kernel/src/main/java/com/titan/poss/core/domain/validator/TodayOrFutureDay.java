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
import static java.lang.annotation.RetentionPolicy.RUNTIME;

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
@Constraint(validatedBy = TodayOrFutureDay.DateFormatValidator.class)
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RetentionPolicy.RUNTIME)
public @interface TodayOrFutureDay {
	String message() default "Date cannot be past date";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
	@Documented
	@Retention(RUNTIME)
	@interface List {
		TodayOrFutureDay[] value();
	}

	public class DateFormatValidator implements ConstraintValidator<TodayOrFutureDay, Date> {

		private String message;

		@Override
		public void initialize(TodayOrFutureDay dateFormat) {
			this.message = dateFormat.message();
		}

		@Override
		public boolean isValid(Date date, ConstraintValidatorContext context) {
			Boolean isValid = true;
			if (date == null) {
				return isValid;
			}
			if (date.compareTo(CalendarUtils.getTOdaysDocDate()) < 0) {
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
