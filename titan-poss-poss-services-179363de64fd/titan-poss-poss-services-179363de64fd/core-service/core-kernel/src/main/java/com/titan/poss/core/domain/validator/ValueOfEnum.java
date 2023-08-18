/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
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
import java.lang.annotation.Target;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.util.StringUtils;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Retention(RUNTIME)
@Target({ FIELD, METHOD, PARAMETER, TYPE_USE, ANNOTATION_TYPE, CONSTRUCTOR })
@Constraint(validatedBy = ValueOfEnum.ValueOfEnumValidator.class)
public @interface ValueOfEnum {

	Class<? extends Enum<?>> enumClass();

	boolean nullCheck() default false;

	String message() default "";

	Class<?>[] groups() default {};

	@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
	@Documented
	@Retention(RUNTIME)
	@interface ListValue {

		ValueOfEnum[] value();
	}

	Class<? extends Payload>[] payload() default {};

	public class ValueOfEnumValidator implements ConstraintValidator<ValueOfEnum, CharSequence> {

		List<String> acceptedValues;

		private static final String CANT_BE_NULL = "The value can't be null";

		private boolean nullCheck;

		private String message;

		private String getMessage(String defaultMessage) {

			if (StringUtils.isEmpty(this.message)) {
				return defaultMessage;
			}
			return this.message;
		}

		@Override
		public void initialize(ValueOfEnum annotation) {
			acceptedValues = Stream.of(annotation.enumClass().getEnumConstants()).map(Enum::name)
					.collect(Collectors.toList());
			this.nullCheck = annotation.nullCheck();
			this.message = annotation.message();
		}

		@Override
		public boolean isValid(CharSequence value, ConstraintValidatorContext context) {

			Boolean isValid = true;

			if (value == null && nullCheck) {
				isValid = false;
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(getMessage(CANT_BE_NULL)).addConstraintViolation();

			} else if (value != null && !acceptedValues.contains(value.toString())) {
				isValid = false;
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(
						"must be any of enum values:- " + acceptedValues.toString()).addConstraintViolation();
			}

			return isValid;
		}

	}
}
