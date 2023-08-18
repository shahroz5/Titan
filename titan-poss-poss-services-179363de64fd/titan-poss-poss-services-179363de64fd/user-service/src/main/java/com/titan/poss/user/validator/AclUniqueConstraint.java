/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import com.titan.poss.user.dto.request.UpdateRolesDetailDto;

/**
 * Validates if ACL in add fields and remove fields are not having any common
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = AclUniqueConstraint.UpdateRoleDetailsDtoValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface AclUniqueConstraint {

	String message() default "Added Acl and Removed Acl can't have any common Acl codes";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class UpdateRoleDetailsDtoValidator
			implements ConstraintValidator<AclUniqueConstraint, UpdateRolesDetailDto> {

		@Override
		public boolean isValid(UpdateRolesDetailDto updateRolesDetailDto, ConstraintValidatorContext context) {
			Boolean isValid = true;
			if (updateRolesDetailDto.getAddAclCodes() != null && updateRolesDetailDto.getRemoveAclCodes() != null) {
				Set<String> addedRoleCodes = updateRolesDetailDto.getAddAclCodes().stream().map(String::toUpperCase)
						.collect(Collectors.toSet());
				Set<String> removedRoleCodes = updateRolesDetailDto.getRemoveAclCodes().stream()
						.map(String::toUpperCase).collect(Collectors.toSet());
				if (!Collections.disjoint(addedRoleCodes, removedRoleCodes)) {
					context.disableDefaultConstraintViolation();
					context.buildConstraintViolationWithTemplate(
							"Added Acl and Removed Acl can't have any common Acl codes").addConstraintViolation();
					isValid = false;
				}
			}
			return isValid;
		}
	}

}
