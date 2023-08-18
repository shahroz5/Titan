/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class to add Catchment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CatchmentAddDto {

	@PatternCheck(regexp = RegExConstants.CATCHMENT_CODE_REGEX, nullCheck = true)
	private String catchmentCode;

	@PatternCheck(regexp = RegExConstants.CATCHMENT_NAME_REGEX, nullCheck = true)
	private String description;

	private Boolean isActive;
}
