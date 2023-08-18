/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Calendar;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import com.titan.poss.inventory.dto.request.ReceiveStockConfirmDto;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
@Documented
@Constraint(validatedBy = StnConfirmDtoConstraint.StnConfirmDtoValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface StnConfirmDtoConstraint {
	String message() default "Reason for delay cannot be empty if the courier is received 48hrs or before";





	Class<?>[] groups() default {};





	Class<? extends Payload>[] payload() default {};


	public class StnConfirmDtoValidator implements ConstraintValidator<StnConfirmDtoConstraint, ReceiveStockConfirmDto> {


		@Override
		public void initialize(StnConfirmDtoConstraint stnConfirmDto) {
			//empty
		}





		@Override
		public boolean isValid(ReceiveStockConfirmDto stnConfirmDto, ConstraintValidatorContext context) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DATE, -2);
			if (stnConfirmDto.getCourierReceivedDate().before(cal.getTime())
					&& stnConfirmDto.getReasonForDelay() == null) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("Reason for delay cannot be empty if the courier is received 48hrs or before")
						.addConstraintViolation();
				return false;
			} else {
				return true;
			}
		}

	}
}
