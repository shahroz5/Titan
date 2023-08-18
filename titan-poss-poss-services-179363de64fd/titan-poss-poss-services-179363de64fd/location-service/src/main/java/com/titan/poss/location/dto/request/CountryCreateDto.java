/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.CURRENCY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100;
import static com.titan.poss.core.domain.constant.RegExConstants.ISD_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCALE_REGEX;

import org.hibernate.validator.constraints.Range;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.DateFormat;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CountryCreateDto {

	@PatternCheck(regexp = COUNTRY_CODE_REGEX, nullCheck = true)
	private String countryCode;

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String description;

	private Boolean isActive;

	@PatternCheck(regexp = CURRENCY_CODE_REGEX, nullCheck = true)
	private String currencyCode;

	@DateFormat
	private String dateFormat;

	@PatternCheck(regexp = LOCALE_REGEX, nullCheck = true)
	private String locale;

	@Range(min = 3, max = 10)
	private Integer phoneLength;

	@DateFormat
	private String timeFormat;

	@PatternCheck(regexp = ISD_CODE_REGEX)
	private String isdCode;

	@PatternCheck(regexp = RegExConstants.MMM_FORMAT_REGEX)
	private String fiscalYearStart;

	private Integer fiscalYear;

	private String weightUnit;

	private String stoneWeightUnit;
}
