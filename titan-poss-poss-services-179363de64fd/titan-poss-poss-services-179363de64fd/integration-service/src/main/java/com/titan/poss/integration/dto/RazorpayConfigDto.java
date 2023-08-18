/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RazorpayConfigDto {

	private String keyId;
	
	private String keySecret;
	
	private Integer expireTimeInMin;
	
	private String name;
	
	private String fetchOrderPaymentsUrl;
}
