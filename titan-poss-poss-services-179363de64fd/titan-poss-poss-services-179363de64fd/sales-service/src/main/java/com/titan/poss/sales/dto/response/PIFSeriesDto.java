/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PIFSeriesDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;

	private String bankName;

	private String paymentCode;

	private Integer fromNo;

	private Integer toNo;

	private Integer currentSeqNo;

	private Boolean isHomeBank;

	private Boolean isActive;
}
