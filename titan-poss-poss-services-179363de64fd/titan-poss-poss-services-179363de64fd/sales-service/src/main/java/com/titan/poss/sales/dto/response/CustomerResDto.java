/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto.response;

import javax.persistence.Column;

import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResDto {

	private Integer customerId;

	private String title;

	private String customerName;

	private String customerType;

	private String ulpId;

	private String mobileNumber;

	private String emailId;

	private String instiTaxNo;

	private String custTaxNo;

	private String passportId;

	private JsonData customerDetails;

	private JsonData emailValidationDetails;

	private Boolean isActive;

	private Boolean isInstiTaxNoVerified;

	private Boolean iscustTaxNoVerified;

	private Boolean isEmailIdValidationInitiated;

	private Boolean isEmailIdValidated;
	
	private Boolean isCustTaxMatched;
	
	private Boolean isForm60Matched;
	
	private String panHolderName;

}
