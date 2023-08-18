/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MetalRateRequestDto extends MetalRateCreateRequestDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255, nullCheck = true)
	private String remarks;

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true)
	private String locationCode;
}
