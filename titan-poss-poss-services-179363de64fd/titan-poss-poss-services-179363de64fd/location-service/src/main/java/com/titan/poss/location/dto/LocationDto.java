/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.ALPHA_NUMERIC_SPL_CHAR_REGEX_MAX_20;
import static com.titan.poss.core.domain.constant.RegExConstants.BRAND_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_LOV_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.MARKET_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.REGION_CODE_REGEX;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.LocationFormatEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class LocationDto {

	@PatternCheck(regexp = ALPHA_NUMERIC_SPL_CHAR_REGEX_MAX_20, nullCheck = true)
	private String locationCode;

	private String description;

	@PatternCheck(regexp = LOCATION_LOV_CODE_REGEX, nullCheck = true)
	private String locationTypeCode;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String townId;

	private String townName;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String stateId;

	private String stateName;

	@PatternCheck(regexp = COUNTRY_CODE_REGEX, nullCheck = true)
	private String countryCode;

	@PatternCheck(regexp = REGION_CODE_REGEX, nullCheck = false)
	private String regionCode;

	@PatternCheck(regexp = LOCATION_LOV_CODE_REGEX, nullCheck = false)
	private String ownerTypeCode;

	@PatternCheck(regexp = LOCATION_CODE_REGEX, nullCheck = false)
	private String factoryCodeValue;

	@PatternCheck(regexp = LOCATION_CODE_REGEX, nullCheck = false)
	private String cfaCodeValue;

	@ValueOfEnum(enumClass = LocationFormatEnum.class, nullCheck = false)
	private String locationFormat;

	@PatternCheck(regexp = BRAND_CODE_REGEX, nullCheck = true)
	private String brandCode;

	@NotNull
	private Boolean isActive;

	@PatternCheck(regexp = MARKET_CODE_REGEX, nullCheck = false)
	private String marketCode;

	@PatternCheck(regexp = REGION_CODE_REGEX, nullCheck = false)
	private String subRegionCode;

	@PatternCheck(regexp = BRAND_CODE_REGEX, nullCheck = true)
	private String subBrandCode;

	private String remarks;

	private String baseCurrency;

	private String stockCurrency;

	private String masterCurrency;

	private String paymentCurrencies;

	private JsonData storeDetails;

	private JsonData printDetails;

	private JsonData cnDetails;

	private JsonData taxDetails;

	private JsonData cmDetails;

	private JsonData grnDetails;

	private JsonData grfDetails;

	private JsonData gepDetails;

	private JsonData gcDetails;

	private JsonData abDetails;

	private JsonData coDetails;

	private JsonData tepDetails;

	private JsonData ghsDetails;

	private JsonData inventoryDetails;

	private JsonData bankingDetails;

	private JsonData otpDetails;

	private JsonData customerDetails;

	private JsonData paymentDetails;

	private JsonData offerDetails;

	private JsonData digigoldDetails;
	
	private JsonData serviceDetails;

	@NotNull
	private Boolean isOffline;
	
	private JsonData tcsDetails;

	private Boolean isAutostn;
	
	
}
