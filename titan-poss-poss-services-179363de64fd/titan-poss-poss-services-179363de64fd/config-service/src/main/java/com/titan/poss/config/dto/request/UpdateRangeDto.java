/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.List;
import java.util.Set;

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
public class UpdateRangeDto {

	List<@Valid DiscountAddRangeDto> addValues;

	List<@Valid DiscountUpdateRangeDto> updateValue;
	
	Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeValues;
	
    private Boolean isActive;

}
