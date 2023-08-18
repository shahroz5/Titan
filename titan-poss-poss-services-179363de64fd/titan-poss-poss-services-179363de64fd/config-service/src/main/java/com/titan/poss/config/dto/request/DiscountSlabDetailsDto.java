/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.List;

import javax.validation.Valid;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountSlabDetailsDto {
	
	private List<@Valid DiscountSlabAddDto> addSlabDetails;
	
	private List<@Valid DiscountSlabUpdateDto> updateSlabDetails;

	private Boolean isActive;

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeDetails;
}
