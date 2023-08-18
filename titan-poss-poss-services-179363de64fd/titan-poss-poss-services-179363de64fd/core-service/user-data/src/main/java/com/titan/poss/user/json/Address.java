/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.json;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * This class contains field of json address field
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class Address {
	@NotNull
	@Length(min = 1, max = 100)
	private String line1;

	@NotNull
	@Length(min = 1, max = 100)
	private String line2;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, message = "Invalid city", nullCheck = true)
	private String city;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, message = "Invalid state", nullCheck = true)
	private String state;

	@Length(min = 1, max = 10)
	@PatternCheck(regexp = "^[\\w]+$", message = "Invalid pincode", nullCheck = true)
	private String pincode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, message = "Invalid country", nullCheck = true)
	private String country;
}
