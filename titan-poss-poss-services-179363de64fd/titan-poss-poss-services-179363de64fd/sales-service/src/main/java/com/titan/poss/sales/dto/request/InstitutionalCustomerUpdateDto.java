/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.NAME_REGEX;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.AddressDetails;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto to update institutional customer details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InstitutionalCustomerUpdateDto extends AddressDetails {

	@PatternCheck(regexp = RegExConstants.CATCHMENT_NAME_REGEX, message = "Invalid Catchment Name", nullCheck = false)
	private String catchmentName;

	@Size(min = 1, max = 50, message = "Authorized Name min length {min} and max length is {max}")
	@PatternCheck(regexp = NAME_REGEX, message = "Invalid Authorized Name", nullCheck = false)
	private String authorizedName;

	@PatternCheck(regexp = RegExConstants.TELEPHONE_REGEX, message = "Invalid Landline number", nullCheck = false)
	private String landlineNumber;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50)
	private String idProof;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20)
	private String idNumber;

	private Boolean isHardCopySubmitted;

	private Boolean form60;

	@Override
	public String toString() {
		return "InstitutionalCustomerUpdateDto [catchmentName=" + catchmentName + ", authorizedName=" + authorizedName
				+ ", landlineNumber=" + landlineNumber + ", idProof=" + idProof + ", idNumber=" + idNumber
				+ ", isHardCopySubmitted=" + isHardCopySubmitted + "]";
	}

}
