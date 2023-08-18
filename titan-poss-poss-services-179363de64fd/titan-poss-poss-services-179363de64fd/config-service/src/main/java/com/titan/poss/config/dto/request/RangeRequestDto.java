/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.Set;

import javax.validation.Valid;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class RangeRequestDto {

	private Set<@Valid AddRangeDto> addRanges;

	private Set<@Valid UpdateRange> updateRanges;

//	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX,nullCheck = true) String> removeRanges;
}
