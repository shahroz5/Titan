/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.validator;

import static com.titan.poss.core.utils.CollectionUtil.isUnique;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import com.titan.poss.user.dto.request.RoleLimitReqDto;
import com.titan.poss.user.dto.request.RoleLimitRequestDto;

/**
 * Validates if ACL in add fields and remove fields are not having any common
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = RoleDuplicateCheckInReq.RoleDuplicateValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface RoleDuplicateCheckInReq {

	String message() default "Roles limit can't be requested more than once in a request";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class RoleDuplicateValidator implements ConstraintValidator<RoleDuplicateCheckInReq, RoleLimitRequestDto> {

		@Override
		public boolean isValid(RoleLimitRequestDto roleLimitRequestDto, ConstraintValidatorContext context) {
			Boolean isValid = true;
			List<RoleLimitReqDto> roleLimitReqDto = roleLimitRequestDto.getRoleLimitReqDto();
			if (roleLimitReqDto == null || roleLimitReqDto.isEmpty())
				return isValid;
			List<String> roles = roleLimitReqDto.stream().map(RoleLimitReqDto::getRoleCode)
					.collect(Collectors.toList());
			return isUnique(roles);

		}
	}

}
