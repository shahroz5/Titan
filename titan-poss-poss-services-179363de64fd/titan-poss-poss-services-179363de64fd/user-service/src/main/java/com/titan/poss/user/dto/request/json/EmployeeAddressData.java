/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.dto.request.json;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Valid
public class EmployeeAddressData {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	String line1;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	String line2;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	String line3;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_DOT_HPN, message = "Invalid city name", nullCheck = true)
	String city;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_DOT_HPN, message = "Invalid state name", nullCheck = true)
	String state;

	@PatternCheck(regexp = RegExConstants.PIN_CODE_REGEX, message = "Invalid pincode", nullCheck = true)
	String pincode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_DOT_HPN, message = "Invalid country name", nullCheck = true)
	String country;

}
