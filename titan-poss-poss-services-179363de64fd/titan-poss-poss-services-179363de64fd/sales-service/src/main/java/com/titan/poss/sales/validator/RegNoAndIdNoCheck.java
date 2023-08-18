/* Copyright 2019. Titan Company Limited
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

import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dto.request.CustomerAddDto;

/**
 * Validates if customer tax number is required when institutional tax number is
 * present for a given customerType.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = RegNoAndIdNoCheck.VerifyRegNoAndIdNo.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface RegNoAndIdNoCheck {

	String message() default "Customer tax number is mandatory if institutional tax number is provided for the given customerType.";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class VerifyRegNoAndIdNo implements ConstraintValidator<RegNoAndIdNoCheck, CustomerAddDto> {

		@Override
		public boolean isValid(CustomerAddDto addCustomerDto, ConstraintValidatorContext context) {
			Boolean isValid = true;

//			if (addCustomerDto.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())
//					&& StringUtils.isBlank(addCustomerDto.getInstiTaxNo())) {
//				context.disableDefaultConstraintViolation();
//				context.buildConstraintViolationWithTemplate(
//						"Institute Tax Number is mandatory for Institutional customer.").addConstraintViolation();
//				
//				isValid = false;
//
//			} 
			/*if (addCustomerDto.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())
					&& !StringUtils.isBlank(addCustomerDto.getInstiTaxNo()) && !addCustomerDto.getIsInstiTaxNoVerified()
					&& StringUtils.isBlank(addCustomerDto.getCustTaxNo())) {

				isValid = false;
			}*/

//			} else if (addCustomerDto.getCustomerType().equals(CustomerTypeEnum.INTERNATIONAL.name())
//					&& StringUtils.isBlank(addCustomerDto.getPassportId())) {
//				context.disableDefaultConstraintViolation();
//				context.buildConstraintViolationWithTemplate("Passport id is mandatory for Institutional customer.")
//						.addConstraintViolation();
//
//				isValid = false;
//			}

			if (!addCustomerDto.getCustomerType().equals(CustomerTypeEnum.INSTITUTIONAL.name())
					&& !StringUtils.isBlank(addCustomerDto.getInstiTaxNo())
					&& StringUtils.isBlank(addCustomerDto.getCustTaxNo())) {

				isValid = false;

			} else if (addCustomerDto.getCustomerDetails() != null) {

				JsonData jsonData = (JsonData) MapperUtil.getDtoMapping(addCustomerDto.getCustomerDetails(),
						JsonData.class);
				Object custDetails = jsonData.getData();

				String idProof = JsonUtils.getValueFromJson(custDetails, "idProof", String.class);
				String idNumber = JsonUtils.getValueFromJson(custDetails, "idNumber", String.class);

				if (StringUtils.isNotBlank(idProof) && StringUtils.isBlank(idNumber)) {

					context.disableDefaultConstraintViolation();
					context.buildConstraintViolationWithTemplate("idNumber is mandatory if idProof is provided.")
							.addConstraintViolation();

					isValid = false;
				}
			}

			return isValid;
		}

	}

}
