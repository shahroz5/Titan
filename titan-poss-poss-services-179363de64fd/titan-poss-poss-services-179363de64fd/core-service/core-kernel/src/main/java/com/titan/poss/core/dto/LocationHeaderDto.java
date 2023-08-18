package com.titan.poss.core.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.BRAND_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_LOV_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.REGION_CODE_REGEX;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationHeaderDto {

	@NotNull(message = "Please provide the locationCode")
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid locationCode")
	private String locationCode;

	@NotNull(message = "Please provide the brandCode")
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid brandCode")
	private String brandCode;

	@NotNull(message = "Please provide the townCode")
//	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid townCode")
	private String townId;

	private String townName;

	@NotNull(message = "Please provide the stateId")
	private String stateId;

	private String stateName;

	@NotNull(message = "Please provide the regionCode")
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid regionCode")
	private String regionCode;

	private String locationTypeCode;

	private String locationFormat;

	private Boolean isActive;

	private String description;

	private String marketCode;

	@PatternCheck(regexp = COUNTRY_CODE_REGEX)
	private String countryCode;

	@PatternCheck(regexp = LOCATION_LOV_CODE_REGEX)
	private String ownerTypeCode;

	@PatternCheck(regexp = LOCATION_CODE_REGEX)
	private String factoryCodeValue;

	@PatternCheck(regexp = LOCATION_CODE_REGEX)
	private String cfaCodeValue;

	@PatternCheck(regexp = REGION_CODE_REGEX)
	private String subRegionCode;

	@PatternCheck(regexp = BRAND_CODE_REGEX)
	private String subBrandCode;

	private String remarks;

	private String baseCurrency;

	private String stockCurrency;

	private String masterCurrency;

	private String paymentCurrencies;

}
