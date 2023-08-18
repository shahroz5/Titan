/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto for one time customer details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class OneTimeCustomerDto extends AddressDetails {

	@PatternCheck(regexp = RegExConstants.CATCHMENT_NAME_REGEX, message = "Invalid Catchment Name", nullCheck = false)
	private String catchmentName;

	private Boolean form60;
	
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50)
	private String idProof;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20)
	private String idNumber;

	@Override
	public String toString() {
		return "OneTimeCustomerDto [catchmentName=" + catchmentName + ", form60=" + form60 + ", idProof=" + idProof
				+ ", idNumber=" + idNumber + "]";
	}

}
