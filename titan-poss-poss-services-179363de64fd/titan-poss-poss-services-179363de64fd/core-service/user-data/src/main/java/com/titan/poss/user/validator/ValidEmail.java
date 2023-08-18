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
import java.util.Arrays;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Validates if provided mail's domain is allowed or not
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = ValidEmail.CheckIfValidMail.class)
//@Constraint(validatedBy = {})
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
//@Repeatable(List.class)
@Retention(RUNTIME)
@Component
public @interface ValidEmail {

	Class<?>[] groups() default {};

	String message() default "Invalid String !!";

	Class<? extends Payload>[] payload() default {};

	@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
	@Documented
	@Retention(RUNTIME)
	@interface List {

		ValidEmail[] value();
	}

	@Component
	public class CheckIfValidMail implements ConstraintValidator<ValidEmail, String> {

		private String[] allowedDomainsForMail;

		@Value("${poss.mail.allowedDomains:titan}")
		public void setAllowedDomainsForMail(String[] allowedDomainsForMail) {
			this.allowedDomainsForMail = allowedDomainsForMail;
		}

		protected String message;

		@Override
		public void initialize(ValidEmail validEmail) {
			// PENDING TASK not taking from env file
			if (allowedDomainsForMail == null)
				allowedDomainsForMail = new String[] { "mindtree", "titan" };
			this.message = validEmail.message() + "  Allowed Domain(s): " + Arrays.toString(allowedDomainsForMail);
		}

		@Override
		public boolean isValid(String value, ConstraintValidatorContext context) {
			if (value == null || !value.contains("@"))
				return true;
			String allowedDomainRegEx = String.join("|", allowedDomainsForMail);
			String emailRegex = "^(?i)[A-Za-z0-9+_.-]+@(?:" + allowedDomainRegEx + ")\\.(?:.*)$";
			context.disableDefaultConstraintViolation();
			context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
			return value.matches(emailRegex);
		}

	}
}