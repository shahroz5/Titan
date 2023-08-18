/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250;
import static com.titan.poss.core.domain.constant.RegExConstants.MARKET_CODE_REGEX;

import java.io.Serializable;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

@Data
public class MarketDto implements Serializable{

	private static final long serialVersionUID = 1L;

	@PatternCheck(regexp = MARKET_CODE_REGEX)
	private String marketCode;

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_250, nullCheck = true)
	private String description;

	private Boolean isActive;
}
