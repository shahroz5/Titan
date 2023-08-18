/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.dto.request;

import java.util.Set;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.engine.dto.TepStoneDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class TepStoneRequestDto {

	private Set<@Valid TepStoneDto> stonesDetails;

	@PatternCheck(regexp = RegExConstants.IND_MOBILE_REGEX)
	private String customerMobileNo;
}
