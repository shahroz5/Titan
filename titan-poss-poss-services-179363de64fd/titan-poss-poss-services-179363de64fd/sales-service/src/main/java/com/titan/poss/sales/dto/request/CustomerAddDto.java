/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.validator.ConsecutiveDuplicateCheck;
import com.titan.poss.sales.validator.IsAddressRequired;
import com.titan.poss.sales.validator.IsMobileNoRequired;
import com.titan.poss.sales.validator.RegNoAndIdNoCheck;

import lombok.Data;

/**
 * Dto to add customer.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@IsMobileNoRequired
@IsAddressRequired
//@AnniversaryDateCheck
@RegNoAndIdNoCheck
public class CustomerAddDto {

	@NotBlank
	@PatternCheck(regexp = RegExConstants.DESIGNATION_REGEX, nullCheck = true)
	@Size(max = 5, message = "max length is {max} for title")
	private String title;

	@ConsecutiveDuplicateCheck(duplicateCount = 3)
	@Size(min = 2, max = 50, message = "customerName min length {min} and max length is {max}")
	@NotNull
	private String customerName;

	@Size(min = 1, max = 20, message = "ULP id min length is {min} and max length is {max}")
	private String ulpId;

	@NotNull
	@ValueOfEnum(enumClass = CustomerTypeEnum.class)
	private String customerType;

	private String mobileNumber;

	@Size(min = 1, max = 100, message = "Email Id min length is {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX)
	private String emailId;

	@PatternCheck(regexp = RegExConstants.PAN_REGEX)
	private String custTaxNo;

	@PatternCheck(regexp = RegExConstants.GST_REGEX)
	private String instiTaxNo;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20)
	private String passportId;

	@NotNull
	@Valid
	private JsonData customerDetails;

	private Boolean isActive = true;

	private Boolean isInstiTaxNoVerified;

	private Boolean iscustTaxNoVerified;

	private Boolean isEmailIdValidationInitiated;

	private Boolean isEmailIdValidated;
	
	private String panHolderName;

}