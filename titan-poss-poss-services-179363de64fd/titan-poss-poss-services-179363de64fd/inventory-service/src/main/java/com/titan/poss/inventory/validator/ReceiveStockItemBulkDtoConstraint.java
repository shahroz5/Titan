/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import com.titan.poss.inventory.dto.request.ReceiveStockItemBulkDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = ReceiveStockItemBulkDtoConstraint.ReceiveStockItemBulkDtoValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ReceiveStockItemBulkDtoConstraint {

	String message() default "Bincode and status both cannot be empty";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class ReceiveStockItemBulkDtoValidator
			implements ConstraintValidator<ReceiveStockItemBulkDtoConstraint, ReceiveStockItemBulkDto> {

		@Override
		public boolean isValid(ReceiveStockItemBulkDto receiveStockItemBulkDto, ConstraintValidatorContext context) {
			if ((receiveStockItemBulkDto.getBinCode() == null || receiveStockItemBulkDto.getBinCode().isEmpty())
					&& (receiveStockItemBulkDto.getStatus() == null || receiveStockItemBulkDto.getStatus().isEmpty())) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("Bincode and status cannot be empty")
						.addConstraintViolation();
				return false;
			} else {
				return true;
			}
		}

	}

}
