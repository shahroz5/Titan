/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.dto.response;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CustomerDto {

	private Integer customerId;

	private String title;

	private String customerName;
	private String customerType;

	private String ulpId;

	private String mobileNumber;
	private String emailId;

	private JsonData customerDetails;

	private Boolean isActive;

	private Boolean isHardCopySubmitted;

	private String instiTaxNo;

	private String custTaxNo;
}
