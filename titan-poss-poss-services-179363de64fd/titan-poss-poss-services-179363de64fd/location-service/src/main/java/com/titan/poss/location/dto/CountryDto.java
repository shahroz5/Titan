/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.CURRENCY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100;
import static com.titan.poss.core.domain.constant.RegExConstants.ISD_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCALE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.MM_DD_FORMAT_REGEX;

import java.util.Date;

import org.hibernate.validator.constraints.Range;

import com.titan.poss.core.domain.validator.DateFormat;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CountryDto {

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
	
	private Integer fiscalYear;

	@DateFormat
	private String timeFormat;

	@PatternCheck(regexp = ISD_CODE_REGEX)
	private String isdCode;

	@PatternCheck(regexp = MM_DD_FORMAT_REGEX)
	private String fiscalYearStart;

	@PatternCheck(regexp = MM_DD_FORMAT_REGEX)
	private String fiscalYearEnd;

	private Date lastModifiedDate;
}
