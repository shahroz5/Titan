/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.validator;

import static com.titan.poss.core.utils.CollectionUtil.disjointCheckFailed;
import static com.titan.poss.core.utils.CollectionUtil.setToUpperCase;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.HashSet;
import java.util.Set;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.apache.commons.lang.StringUtils;

import com.titan.poss.user.dto.request.CorporateAddUserDto;
import com.titan.poss.user.dto.request.StoreAddUserDto;

/**
 * Validates if roles in adding temp roles and primary roles have nothing in
 * common
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = RoleUniqueConstraintsInAdd.UpdateEmployeeDetailsDtoValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface RoleUniqueConstraintsInAdd {

	String message() default "Role(s) can't have any common in addTempRole, primaryTempRole";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class UpdateEmployeeDetailsDtoValidator implements ConstraintValidator<RoleUniqueConstraintsInAdd, Object> {

		@Override
		public boolean isValid(Object object, ConstraintValidatorContext context) {
			Boolean isValid = true;

			String primaryRoleCode = null;
			Set<String> tempRoles = new HashSet<>();

			if (StoreAddUserDto.class.isAssignableFrom(object.getClass())) {
				StoreAddUserDto storeAddUserDto = (StoreAddUserDto) object;
				primaryRoleCode = storeAddUserDto.getPrimaryRoleCode();
				tempRoles = storeAddUserDto.getTempRoleCodes();
			} else if (CorporateAddUserDto.class.isAssignableFrom(object.getClass())) {
				CorporateAddUserDto corporateAddUserDto = (CorporateAddUserDto) object;
				primaryRoleCode = corporateAddUserDto.getPrimaryRoleCode();
				tempRoles = corporateAddUserDto.getTempRoleCodes();
			}

			if ((tempRoles != null && !tempRoles.isEmpty()) || primaryRoleCode != null) {
				Set<String> addedTempRoleCodes = setToUpperCase(tempRoles);
				Set<String> primaryRoleCodes = new HashSet<>();
				if (StringUtils.isNotBlank(primaryRoleCode))
					primaryRoleCodes.add(primaryRoleCode.toUpperCase().trim());
				if (disjointCheckFailed(addedTempRoleCodes, primaryRoleCodes))
					isValid = false;
			}
			return isValid;
		}
	}

}
