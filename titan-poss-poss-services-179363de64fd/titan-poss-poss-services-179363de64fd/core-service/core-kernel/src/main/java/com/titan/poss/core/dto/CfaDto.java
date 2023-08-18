/*  
l3XmnVn8TnmGXHMc * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_50;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CfaDto {

	private String locationCode;
	
	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_50)
	private String description;
	
	private String locationTypeCode;
    //private Object cfaAddress;

}
