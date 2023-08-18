/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * Covert order to Cash memo request dto
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class OrderToCashMemoRequestDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String cashMemoId;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String orderId;

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> itemIds;

}
