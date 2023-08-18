/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.Set;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class ExchangeConfigLocationsMappingRequestDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String excludeConfigId;

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> includeLocations;
}
