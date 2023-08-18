/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.validator;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.stereotype.Component;

/**
 * Validate if duplicateCount or more consecutive characters are present.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = ConsecutiveDuplicateCheck.VerifyConsecutiveCharacters.class)
@Target({ FIELD })
@Retention(RUNTIME)
@Component
public @interface ConsecutiveDuplicateCheck {

	int duplicateCount();

	String message() default "{duplicateCount} or more repeating characters are not allowed.";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	@Target({ FIELD })
	@Retention(RUNTIME)
	@Documented
	@interface List {

		ConsecutiveDuplicateCheck[] value();
	}

	@Component
	public class VerifyConsecutiveCharacters implements ConstraintValidator<ConsecutiveDuplicateCheck, String> {

		protected int duplicateCount;

		@Override
		public void initialize(ConsecutiveDuplicateCheck annotation) {
			duplicateCount = annotation.duplicateCount();
		}

		@Override
		public boolean isValid(String customerName, ConstraintValidatorContext context) {

			return checkDuplicateCharacters(customerName.toUpperCase(), duplicateCount);
		}

		private boolean checkDuplicateCharacters(String name, int duplicateCount) {
			if (name == null || name.isEmpty() || name.length() < duplicateCount) {
				return true;
			}

			boolean isDuplicate = false;
			for (int i = 0; i < name.length() - duplicateCount + 1; i++) {
				isDuplicate = allCharactersSame(name.substring(i, i + duplicateCount));

				if (isDuplicate) {
					break;
				}
			}

			return !isDuplicate;
		}

		private static boolean allCharactersSame(String str) {

			int n = str.length();
			for (int i = 1; i < n; i++)
				if (str.charAt(i) != str.charAt(0))
					return false;
			return true;
		}

	}

}
