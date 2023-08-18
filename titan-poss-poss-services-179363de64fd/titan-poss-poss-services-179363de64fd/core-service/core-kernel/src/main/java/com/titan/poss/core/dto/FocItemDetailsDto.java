/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class to list the EligibleFocItems in a FOC scheme of cash memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocItemDetailsDto {

	private String lotNumber;
	
	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

}
