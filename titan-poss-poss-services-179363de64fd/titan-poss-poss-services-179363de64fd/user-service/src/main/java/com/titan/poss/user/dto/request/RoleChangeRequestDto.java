/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.dto.request;

import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * DTO class for role limit changing body
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RoleChangeRequestDto {

	@Valid
	@Size(min = 1)
	Set<RoleLimitReqDto> roles;
}
