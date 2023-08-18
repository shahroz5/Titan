/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.Set;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class UpdateMarketMappingDto {

	Set<@PatternCheck(regexp = RegExConstants.MARKET_CODE_REGEX, caseInsensitive = true) String> addMarkets;

	Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeMarkets;
}
