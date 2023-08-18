/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.List;


import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LocationFilterDto {

	private List<@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String> brandCodes;

	private List<@PatternCheck(regexp = RegExConstants.REGION_CODE_REGEX) String> regionCodes;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_LOV_CODE_REGEX) String> ownerTypeCodes;

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> stateCodes;

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> townCodes;

	private List<@PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX, caseInsensitive = true) String> countryCodes;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_LOV_CODE_REGEX) String> locationTypes;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, caseInsensitive = true) String> factoryCodes;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, caseInsensitive = true) String> cfaCodes;

	private List<@PatternCheck(regexp = RegExConstants.MARKET_CODE_REGEX, caseInsensitive = true) String> marketCodes;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_LOV_CODE_REGEX) String> locationFormats;
	
	private Boolean isMigartedFromLegacy;
	
	private Boolean isLocationFromTep;
	
}
