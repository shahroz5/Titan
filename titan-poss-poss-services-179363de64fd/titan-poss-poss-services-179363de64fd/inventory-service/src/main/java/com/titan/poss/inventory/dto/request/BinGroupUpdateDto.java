/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BinGroupUpdateDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String description;

	private Boolean isActive;

}
