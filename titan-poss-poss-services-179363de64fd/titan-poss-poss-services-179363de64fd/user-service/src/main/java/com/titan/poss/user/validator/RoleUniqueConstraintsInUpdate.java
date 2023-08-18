/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.validator;

import static com.titan.poss.core.utils.CollectionUtil.isUnique;
import static com.titan.poss.core.utils.CollectionUtil.setToUpperCase;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.CollectionUtils;

import com.titan.poss.user.dto.request.BaseUpdateUserDto;

/**
 * Validates if roles in adding temp roles, removing temp roles, and primary
 * roles have nothing in common
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = RoleUniqueConstraintsInUpdate.UpdateEmployeeDetailsDtoValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface RoleUniqueConstraintsInUpdate {

	String message()

	default "Role(s) can't have any common in addTempRole, removeTempRole, primaryTempRole";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class UpdateEmployeeDetailsDtoValidator
			implements ConstraintValidator<RoleUniqueConstraintsInUpdate, BaseUpdateUserDto> {

		@Override
		public boolean isValid(BaseUpdateUserDto baseUpdateUserDto, ConstraintValidatorContext context) {
			Boolean isValid = true;
			if (baseUpdateUserDto.getAddTempRoleCodes() != null || baseUpdateUserDto.getRemoveTempRoleCodes() != null
					|| StringUtils.isNotBlank(baseUpdateUserDto.getPrimaryRoleCode())) {
				List<String> allRoles = new ArrayList<>();
				if (!CollectionUtils.isEmpty(baseUpdateUserDto.getAddTempRoleCodes()))
					allRoles.addAll(setToUpperCase(baseUpdateUserDto.getAddTempRoleCodes()));
				if (!CollectionUtils.isEmpty(baseUpdateUserDto.getRemoveTempRoleCodes()))
					allRoles.addAll(setToUpperCase(baseUpdateUserDto.getRemoveTempRoleCodes()));
				if (StringUtils.isNotBlank(baseUpdateUserDto.getPrimaryRoleCode()))
					allRoles.add(baseUpdateUserDto.getPrimaryRoleCode().toUpperCase().trim());
				isValid = isUnique(allRoles);
			}
			return isValid;
		}
	}
}