/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.inventory.validator.StnConfirmDtoConstraint;

import lombok.Data;

/**
 * DTO class for Conforming Stn
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StnCancelDto {

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String cancelRemarks;
	
	private long count;

}
