/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
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

import com.titan.poss.sales.dto.constants.GRNCancellationTypeEnum;
import com.titan.poss.sales.dto.request.BaseCancelGRNDto;

/**
 * Validates if 'reasonForCancellation' required or not </br>
 * Validates if more than 1 item allowed or not based on cancelType
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = CancelDtoValidation.ValidAllFields.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface CancelDtoValidation {

	String message()

	default "Dto validation fails";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class ValidAllFields implements ConstraintValidator<CancelDtoValidation, BaseCancelGRNDto> {

		@Override
		public boolean isValid(BaseCancelGRNDto baseCancelGRNDto, ConstraintValidatorContext context) {

			Boolean isValid = true;

			GRNCancellationTypeEnum cancelType = null;

			try {
				cancelType = GRNCancellationTypeEnum.valueOf(baseCancelGRNDto.getCancelType());
			} catch (Exception e) {
				return true;
			}

			if (cancelType == GRNCancellationTypeEnum.REGULAR_GRN
					&& StringUtils.isBlank(baseCancelGRNDto.getReasonForCancellation())) {

				isValid = false;
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(
						"'reasonForCancellation' is mandatory for 'Regular GRN' cancel type.").addConstraintViolation();

			}

			return isValid;
		}
	}
}
