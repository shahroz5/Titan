/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.validator;

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

import org.springframework.util.CollectionUtils;

import com.titan.poss.user.dto.constants.LocationFormatEnum;
import com.titan.poss.user.dto.request.AddRoleDetailsDto;
import com.titan.poss.user.util.RoleUtil;

/**
 * Validates if user limit is assigned for all location formats while adding
 * role(BTQ role).
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = RoleToLocationFormatCheck.RoleToLocationFormatValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface RoleToLocationFormatCheck {

	String message() default "Please provide role limit for all location formats";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class RoleToLocationFormatValidator
			implements ConstraintValidator<RoleToLocationFormatCheck, AddRoleDetailsDto> {

		@Override
		public boolean isValid(AddRoleDetailsDto addRoleDetailsDto, ConstraintValidatorContext context) {
			Boolean isValid = true;

			Set<String> locationCodes = new HashSet<>();

			LocationFormatEnum[] locationformats = LocationFormatEnum.values();
			Set<String> locationFormatSet = new HashSet<>();

			for (int i = 0; i < locationformats.length; i++) {
				locationFormatSet.add(locationformats[i].name());
			}

			if (RoleUtil.isRoleBelongToBtq(addRoleDetailsDto.getAccessType())) {

				if (CollectionUtils.isEmpty(addRoleDetailsDto.getAddRoleToLocationFormats())) {
					isValid = false;
				} else {
					addRoleDetailsDto.getAddRoleToLocationFormats()
							.forEach(locRole -> locationCodes.add(locRole.getLocationFormat()));
					if (!locationCodes.containsAll(locationFormatSet))
						isValid = false;
				}
			}

			return isValid;
		}

	}

}
