/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.response;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RazorpayPaymentDetailsResponseDto {

	private Integer amount;
	
	@JsonProperty("created_at")
	private Date createdAt;
	
	private String method;
	
	@JsonProperty("payment_id")
	private String paymentId;
	
	private String status;
}

