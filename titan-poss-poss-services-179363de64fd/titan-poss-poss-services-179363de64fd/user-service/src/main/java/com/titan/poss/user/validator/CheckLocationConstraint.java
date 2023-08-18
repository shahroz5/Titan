/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.validator;

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

import com.titan.poss.user.dto.request.CorporateAddUserDto;

/**
 * Validates if both 'location code' & 'region code' are not provided
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = CheckLocationConstraint.CheckLocationConstrains.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckLocationConstraint {

	String message()

	default "At most one location needs to be provided";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class CheckLocationConstrains implements ConstraintValidator<CheckLocationConstraint, CorporateAddUserDto> {

		@Override
		public boolean isValid(CorporateAddUserDto addUserDto, ConstraintValidatorContext context) {
			Boolean isValid = true;
			int locationTypeCount = 0;

			if (StringUtils.isNotBlank(addUserDto.getLocationCode()))
				locationTypeCount++;
			if (StringUtils.isNotBlank(addUserDto.getRegionCode()))
				locationTypeCount++;
			if (locationTypeCount > 1) {
				isValid = false;
			}
			return isValid;
		}
	}

}
