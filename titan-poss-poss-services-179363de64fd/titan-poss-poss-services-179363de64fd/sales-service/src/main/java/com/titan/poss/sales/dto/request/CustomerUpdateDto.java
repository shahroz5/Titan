/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.validator.ConsecutiveDuplicateCheck;
import com.titan.poss.sales.validator.IsAddressRequired;

import lombok.Data;

@Data
@IsAddressRequired
public class CustomerUpdateDto {

	@Size(min = 1, max = 5, message = "min length is {min} and max length is {max} for title")
	private String title;

	@Size(min = 1, max = 100, message = "Email Id min length is {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX, nullCheck = false)
	private String emailId;

	@PatternCheck(regexp = RegExConstants.PAN_REGEX)
	private String custTaxNo;

	@PatternCheck(regexp = RegExConstants.GST_REGEX)
	private String instiTaxNo;
	
	
	//@PatternCheck(regexp = RegExConstants.PASSPORT)
	private String passportId;

	private Boolean isInstiTaxNoVerified;

	private Boolean iscustTaxNoVerified;

	@Valid
	private JsonData customerDetails;

	private Boolean isEmailIdValidationInitiated;

	private Boolean isEmailIdValidated;
	
	private String mobileNumber;
	
	private String panHolderName;

}
