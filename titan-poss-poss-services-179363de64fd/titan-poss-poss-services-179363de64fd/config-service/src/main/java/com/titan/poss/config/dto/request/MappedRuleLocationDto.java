/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.Set;

import javax.validation.constraints.Positive;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MappedRuleLocationDto {

	@Positive
	private Integer excludeRuleId;

	
	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> includeLocations;

}
