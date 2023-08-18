/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.report.dto.constants.LovTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class LovCreateDto {

	@ValueOfEnum(enumClass = LovTypeEnum.class)
	private String lovType;

	private String code;

	private String value;

}
