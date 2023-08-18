/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.validator;

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

import com.titan.poss.product.dto.request.PurityCreateDto;

/**
 * Validates if karat is present when metal Type code is J(Gold) and if purity
 * is present when metal type code is not J(Gold).
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = PurityKaratCheck.PurityKaratValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface PurityKaratCheck {

	public static final String GOLD = "J";

	String message() default "Karat is mandatory for the given metal type code.";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class PurityKaratValidator implements ConstraintValidator<PurityKaratCheck, PurityCreateDto> {

		@Override
		public boolean isValid(PurityCreateDto purityCreateDto, ConstraintValidatorContext context) {
			Boolean isValid = true;

			if (GOLD.equals(purityCreateDto.getItemTypeCode()) && StringUtils.isEmpty(purityCreateDto.getKarat())) {

				isValid = false;

			}

			return isValid;

		}
	}

}
