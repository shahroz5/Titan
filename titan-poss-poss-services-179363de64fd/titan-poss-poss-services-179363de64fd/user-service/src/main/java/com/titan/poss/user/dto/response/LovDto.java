/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.response;

import java.util.List;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.user.dto.KeyValueDto;
import com.titan.poss.user.dto.constants.LovTypeEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LovDto {

	@ValueOfEnum(enumClass = LovTypeEnum.class)
	private String lovType;

	private List<KeyValueDto> results;
}
