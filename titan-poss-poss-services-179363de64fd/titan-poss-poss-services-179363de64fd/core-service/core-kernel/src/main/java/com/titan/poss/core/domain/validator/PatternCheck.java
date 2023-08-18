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
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.regex.Pattern;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.RegExConstants;

/**
 * Validates if regular expression passes
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Documented
@Constraint(validatedBy = PatternCheck.PatternCheckValidator.class)
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(value = PatternCheck.List.class)
public @interface PatternCheck {
	String message() default "";

	String regexp();

	boolean nullCheck() default false;

	boolean caseInsensitive() default false;

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	@Documented
	@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
	@Retention(RUNTIME)
	public @interface List {

		PatternCheck[] value();
	}

	public class PatternCheckValidator implements ConstraintValidator<PatternCheck, String> {

		private static final String CANT_BE_NULL = "The value can't be null";
		private static final String INVALID = RegExConstants.REGEX_MSG;

		private static final String INSENSITIVE_REGEX = "(?i)";

		private String regexp;
		private boolean nullCheck;
		private String message;

		private String getMessage(String defaultMessage) {

			if (StringUtils.isEmpty(this.message)) {
				return defaultMessage;
			}
			return this.message;
		}

		@Override
		public void initialize(PatternCheck patternCheck) {
			this.regexp = patternCheck.regexp();
			this.message = patternCheck.message();
			this.nullCheck = patternCheck.nullCheck();
			if (patternCheck.caseInsensitive() && this.regexp != null)
				this.regexp = INSENSITIVE_REGEX.concat(regexp);
		}

		@Override
		public boolean isValid(String value, ConstraintValidatorContext context) {

			Boolean isValid = true;

			if (value == null && nullCheck) {
				isValid = false;
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(getMessage(CANT_BE_NULL)).addConstraintViolation();
			} else if (value != null) {
				isValid = Pattern.matches(regexp, value);
				if (!isValid) {
					context.disableDefaultConstraintViolation();
					context.buildConstraintViolationWithTemplate(getMessage(INVALID + " Regular expression: " + regexp))
							.addConstraintViolation();
				}
			}

			return isValid;
		}
	}
}
