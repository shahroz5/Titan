/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CustomLotMasterDto {

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX)
	private String lotNumber;

	private String txnType;

	private String txnCode;

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX)
	private String locationCode;

	private Integer sequenceNo;
}
