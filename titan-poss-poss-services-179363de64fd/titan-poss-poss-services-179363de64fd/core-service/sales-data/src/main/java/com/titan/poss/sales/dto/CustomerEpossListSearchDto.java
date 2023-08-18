/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerEpossListSearchDto {

	private  int customerId;
	private String customerType;

	private String customerName;

	private String mobileNumber;
	private String ulpId;

	private String emailId;

	private String instiTaxNo;
	private String custTaxNo;

	private String passportId;
	
	private JsonData customerDetails;

}
