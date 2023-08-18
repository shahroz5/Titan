package com.titan.poss.inventory.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

@Data
public class CourierUpdateDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String address;

	@PatternCheck(regexp = RegExConstants.STATE_NAME_REGEX)
	private String stateName;

	@PatternCheck(regexp = RegExConstants.TOWN_NAME_REGEX)
	private String townName;

	@PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX)
	private String countryCode;

	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX)
	private String mailId;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_255)
	private String description;

	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX)
	private String mobileNumber;

	@PatternCheck(regexp = RegExConstants.NAME_REGEX)
	private String contactPerson;

	private Boolean isActive;
}
