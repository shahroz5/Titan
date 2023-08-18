/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class EventOrderPaymentsDto {
	
	private String paymentType;
	private String currencyCode;
	private String exchangeRate;
}
