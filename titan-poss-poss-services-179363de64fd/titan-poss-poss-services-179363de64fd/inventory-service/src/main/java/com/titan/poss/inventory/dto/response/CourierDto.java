/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CourierDto {

	@PatternCheck(regexp = RegExConstants.COURIER_NAME_REGEX, nullCheck = true)
	private String courierName;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String address;

	@PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX, nullCheck = true)
	private String countryCode;

	@PatternCheck(regexp = RegExConstants.STATE_NAME_REGEX)
	private String stateName;

	@PatternCheck(regexp = RegExConstants.TOWN_NAME_REGEX)
	private String townName;

	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX, nullCheck = true)
	private String mailId;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_255, nullCheck = true)
	private String description;

	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX, nullCheck = true)
	private String mobileNumber;

	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = true)
	private String contactPerson;

	private Boolean isActive;

}
