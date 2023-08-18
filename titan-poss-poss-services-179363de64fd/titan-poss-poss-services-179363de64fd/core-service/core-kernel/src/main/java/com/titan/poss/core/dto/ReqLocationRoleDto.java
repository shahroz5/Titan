/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.core.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.LocationFormatEnum;
import com.titan.poss.core.domain.constant.OwnerTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;

/**
 * DTO class for create 'location code' specific role limit
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ReqLocationRoleDto {

	@NotNull
	@ValueOfEnum(enumClass = LocationFormatEnum.class)
	private String locationFormat;

	@NotNull
	@ValueOfEnum(enumClass = OwnerTypeEnum.class)
	private String ownerType;

}
