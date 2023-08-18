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
 * @version 2.0
 */
@Data
public class BinRequestCreateDto {

	@PatternCheck(regexp = RegExConstants.BIN_REGEX, nullCheck = true)
	private String bin;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX, nullCheck = true)
	private String remarks;
}
