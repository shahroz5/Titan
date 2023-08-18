/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.AddressDetails;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto to update international customer details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InternationalCustomerUpdateDto extends AddressDetails {

	private Boolean isNRI;

	// validation pending
	@Size(min = 1, max = 30, message = "Partner Proprietorship min length is {min} and max length is {max}")
	private String partnerProprietorship;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20, message = "Invalid value for Id Proof Number")
	private String idNumber;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_SPACE_REGEX, message = "Invalid value for Id Proof Submitted")
	private String idProof;

	private Boolean isHardCopySubmitted;

	private Boolean form60;

	@Override
	public String toString() {
		return "InternationalCustomerUpdateDto [isNRI=" + isNRI + ", partnerProprietorship=" + partnerProprietorship
				+ ", idNumber=" + idNumber + ", idProof=" + idProof + ", isHardCopySubmitted=" + isHardCopySubmitted
				+ ", form60=" + form60 + "]";
	}
	
}
