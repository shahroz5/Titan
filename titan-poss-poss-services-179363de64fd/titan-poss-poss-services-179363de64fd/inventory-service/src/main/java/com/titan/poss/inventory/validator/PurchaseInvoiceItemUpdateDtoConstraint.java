package com.titan.poss.inventory.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.math.BigDecimal;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import com.titan.poss.inventory.dto.request.PurchaseInvoiceItemUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = PurchaseInvoiceItemUpdateDtoConstraint.PurchaseInvoiceItemUpdateDtoValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface PurchaseInvoiceItemUpdateDtoConstraint {
	String message() default "Weight should be zero if the quantity is zero";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class PurchaseInvoiceItemUpdateDtoValidator
			implements ConstraintValidator<PurchaseInvoiceItemUpdateDtoConstraint, PurchaseInvoiceItemUpdateDto> {

		@Override
		public boolean isValid(PurchaseInvoiceItemUpdateDto invoiceItemUpdateDto, ConstraintValidatorContext context) {
			if (invoiceItemUpdateDto.getMeasuredWeight().compareTo(BigDecimal.ZERO) == 0) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(
						"Measured Weight shouldn' be zero if the quantity is more than zero").addConstraintViolation();
				return false;
			} else {
				return true;
			}
		}

	}

}
