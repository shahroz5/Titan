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

import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.sales.dto.request.CustomerAddDto;

/**
 * Validates if mobile no. is required for the given customerType.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = IsMobileNoRequired.VerifyMobileNumber.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface IsMobileNoRequired {

	String message() default "Mobile number is mandatory for the customer type.";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class VerifyMobileNumber implements ConstraintValidator<IsMobileNoRequired, CustomerAddDto> {

		@Override
		public boolean isValid(CustomerAddDto addCustomerDto, ConstraintValidatorContext context) {

			Boolean isValid = true;
			String mobileNo = addCustomerDto.getMobileNumber();

			CustomerTypeEnum customerType = null;
			try {
				customerType = CustomerTypeEnum.valueOf(addCustomerDto.getCustomerType());
			} catch (Exception e) {
				isValid = false;
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(
						"customer type must be any of enum values:- " + CustomerTypeEnum.values())
						.addConstraintViolation();
				return isValid;
			}

			if (customerType == CustomerTypeEnum.REGULAR && StringUtils.isEmpty(mobileNo)) {
				isValid = false;
			}

			return isValid;
		}

	}
}
