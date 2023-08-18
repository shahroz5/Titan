/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.util.CollectionUtils;

import com.titan.poss.user.dto.request.BaseAddUserDto;
import com.titan.poss.user.dto.request.BaseUpdateUserDto;

/**
 * Validates if expiry time provided if temporary roles are provided
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = ExpiryTimeConstraint.CheckTempRoleTimeValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ExpiryTimeConstraint {

	static final String ERROR_MESSAGE = "'startDate' & 'expiryDate' are mandatory if temporary role(s) are provided to add";

	String message() default ERROR_MESSAGE;

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class CheckTempRoleTimeValidator implements ConstraintValidator<ExpiryTimeConstraint, Object> {

		@Override
		public boolean isValid(Object object, ConstraintValidatorContext context) {
			Boolean isValid = true;
			Set<String> tempRoles = new HashSet<>();
			Date startDate = null;
			Date expiryDate = null;
			Date updateTempStartDate = null;
			Date updateTempExpiryDate = null;
			if (BaseAddUserDto.class.isAssignableFrom(object.getClass())) {
				BaseAddUserDto baseAddUserDto = (BaseAddUserDto) object;
				tempRoles = baseAddUserDto.getTempRoleCodes();
				startDate = baseAddUserDto.getStartDate();
				expiryDate = baseAddUserDto.getExpiryDate();
			} else if (BaseUpdateUserDto.class.isAssignableFrom(object.getClass())) {
				BaseUpdateUserDto baseUpdateUserDto = (BaseUpdateUserDto) object;
				startDate = baseUpdateUserDto.getStartDate();
				expiryDate = baseUpdateUserDto.getExpiryDate();
				tempRoles = baseUpdateUserDto.getAddTempRoleCodes();
				updateTempStartDate = baseUpdateUserDto.getUpdateTempStartTime();
				updateTempExpiryDate = baseUpdateUserDto.getUpdateTempExpiryTime();
			}
			if (!CollectionUtils.isEmpty(tempRoles) && (expiryDate == null || startDate == null)) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(ERROR_MESSAGE).addConstraintViolation();
				isValid = false;
			}
			if ((startDate != null && expiryDate != null) && startDate.after(expiryDate)) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("Expiry date should be after start date")
						.addConstraintViolation();
				isValid = false;
			}
			if ((updateTempStartDate != null && updateTempExpiryDate != null)
					&& updateTempStartDate.after(updateTempExpiryDate)) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("Expiry date should be after start date")
						.addConstraintViolation();
				isValid = false;
			}
			return isValid;
		}
	}
}
