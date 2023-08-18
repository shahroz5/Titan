/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.NAME_REGEX;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto to add institutional customer details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InstitutionalCustomerCreateDto extends AddressDetails {

	@PatternCheck(regexp = RegExConstants.CATCHMENT_NAME_REGEX, message = "Invalid Catchment Name", nullCheck = true)
	private String catchmentName;

	@Size(min = 1, max = 50, message = "Authorized Name min length {min} and max length is {max}")
	@PatternCheck(regexp = NAME_REGEX, message = "Invalid Authorized Name", nullCheck = true)
	private String authorizedName;

	@PatternCheck(regexp = RegExConstants.TELEPHONE_REGEX, message = "Invalid Landline number")
	private String landlineNumber;

	@NotNull
	private Boolean isIndividualCustomer;

	private Boolean form60;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50)
	private String idProof;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20)
	private String idNumber;
	
	private String form60Number;
	
	private String form60IdType;

	@NotNull
	private Boolean isHardCopySubmitted;

	@Override
	public String toString() {
		return "InstitutionalCustomerCreateDto [catchmentName=" + catchmentName + ", authorizedName=" + authorizedName
				+ ", landlineNumber=" + landlineNumber + ", isIndividualCustomer=" + isIndividualCustomer + ", form60="
				+ form60 + ", idProof=" + idProof + ", idNumber=" + idNumber + ", form60Number=" + form60Number
				+ ", form60IdType=" + form60IdType + ", isHardCopySubmitted=" + isHardCopySubmitted + "]";
	}


	

}
