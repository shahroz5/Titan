/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class FocSchemesAbCreateDto {

	private String id;

	private String salesTxnId;

	private JsonData schemeDetails;

	private JsonData purchaseItemDetails;

	private String status;

	private JsonData headerConfigDetails;

	private JsonData rowConfigDetails;

	private JsonData productGroupDetails;

	private JsonData focItemDetails;
}
