/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.AddressDetails;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto to update regular customer details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class RegularCustomerUpdateDto extends AddressDetails {

	@PatternCheck(regexp = RegExConstants.CATCHMENT_NAME_REGEX, message = "Invalid Catchment name")
	private String catchmentName;

	private Boolean canSendSMS;

	private Boolean form60;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50)
	private String idProof;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20)
	private String idNumber;

	private Boolean isHardCopySubmitted;

	@Override
	public String toString() {
		return "RegularCustomerUpdateDto [catchmentName=" + catchmentName + ", canSendSMS=" + canSendSMS + ", idProof="
				+ idProof + ", idNumber=" + idNumber + ", isHardCopySubmitted=" + isHardCopySubmitted + "]";
	}

}
