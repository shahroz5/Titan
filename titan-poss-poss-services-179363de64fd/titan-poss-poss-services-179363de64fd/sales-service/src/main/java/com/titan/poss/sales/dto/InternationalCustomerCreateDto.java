/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto to add international customer details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InternationalCustomerCreateDto extends AddressDetails {

	@NotNull
	private Boolean isNRI;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50)
	private String idProof;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20)
	private String idNumber;

	@NotNull
	private Boolean isHardCopySubmitted;

	private Boolean form60;

	@Override
	public String toString() {
		return "InternationalCustomerCreateDto [isNRI=" + isNRI + ", idProof=" + idProof + ", idNumber=" + idNumber
				+ ", isHardCopySubmitted=" + isHardCopySubmitted + ", form60=" + form60 + "]";
	}


}
