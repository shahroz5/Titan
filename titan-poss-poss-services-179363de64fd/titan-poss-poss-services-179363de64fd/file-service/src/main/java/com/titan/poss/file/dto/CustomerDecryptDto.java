/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CustomerDecryptDto {

	private String customerId;
	private String customerName;
	private String customerMobileNumber;
	private String customerTaxNo;
	private String customerUlpId;
}
