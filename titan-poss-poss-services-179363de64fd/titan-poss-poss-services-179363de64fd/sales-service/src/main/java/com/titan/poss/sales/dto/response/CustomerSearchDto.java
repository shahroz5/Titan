/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CustomerSearchDto {

	private Integer customerId;

	private String title;
	private String customerType;
	private String customerName;

	private String mobileNumber;
	private String custTaxNo;
	private String instiTaxNo;
	private String passportId;

	private String ulpId;
	private String currentTier;
	private Boolean isMemberBlocked;
	private Boolean isPulseCustomer;

	private JsonData customerDetails;
	private String emailId;
}
