/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.BRAND_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.FAX_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_LOV_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.MARKET_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.REGION_CODE_REGEX;

import com.titan.poss.core.domain.constant.LocationFormatEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationUpdateDto {

	//@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String description;

	@PatternCheck(regexp = FAX_CODE_REGEX)
	private String fax;

	@PatternCheck(regexp = LOCATION_LOV_CODE_REGEX)
	private String locationTypeCode;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String townId;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String stateId;

	@PatternCheck(regexp = COUNTRY_CODE_REGEX)
	private String countryCode;

	@PatternCheck(regexp = REGION_CODE_REGEX)
	private String regionCode;

	@PatternCheck(regexp = LOCATION_LOV_CODE_REGEX)
	private String ownerTypeCode;

	@PatternCheck(regexp = LOCATION_CODE_REGEX)
	private String factoryCodeValue;

	@PatternCheck(regexp = LOCATION_CODE_REGEX)
	private String cfaCodeValue;

	@ValueOfEnum(enumClass = LocationFormatEnum.class)
	private String locationFormat;

	@PatternCheck(regexp = BRAND_CODE_REGEX)
	private String brandCode;

	private Boolean isActive;

	@PatternCheck(regexp = MARKET_CODE_REGEX)
	private String marketCode;

	@PatternCheck(regexp = REGION_CODE_REGEX)
	private String subRegionCode;

	@PatternCheck(regexp = BRAND_CODE_REGEX)
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

	private JsonData ghsDetails;
	
	private JsonData tepDetails;

	private JsonData inventoryDetails;

	private JsonData bankingDetails;

	private JsonData otpDetails;

	private JsonData customerDetails;

	private JsonData paymentDetails;

	private JsonData offerDetails;
	
	private JsonData digigoldDetails;

	private Boolean isOffline;
	
	private JsonData tcsDetails;
	
    private JsonData serviceDetails;
	
	private Boolean isAutostn;

}
