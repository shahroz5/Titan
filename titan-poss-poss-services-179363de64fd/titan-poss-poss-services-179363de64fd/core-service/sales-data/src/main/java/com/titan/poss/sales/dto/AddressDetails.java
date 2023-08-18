/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class for address details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class AddressDetails {

	private List<@Size(max = 40, message = "address line's max lenght is {max}") @NotBlank String> addressLines;

	private String pincode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_DOT_HPN, message = "Invalid city")
	private String city;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250, message = "Invalid state")
	private String state;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_DOT_HPN, message = "Invalid country")
	private String country;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_SPACE_REGEX, message = "Invalid zone")
	private String zone;

	@Override
	public String toString() {
		return "AddressDetails [addressLines=" + addressLines + ", pincode=" + pincode + ", city=" + city + ", state="
				+ state + ", country=" + country + ", zone=" + zone + "]";
	}

}
