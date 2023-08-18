/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper=false)
public class RazorpayCreateRequestDto extends RazaorpayBaseRequestDto {

	private Integer amount;

	private String currency;

	@JsonProperty("reference_id")
	private String referenceId;

	private RazorpayCustomerDto customer;

	@JsonProperty("expire_by")
	private long expireBy;

	private RazorpayNotifyRequestDto notify;
	
	private RazorpayRequestOptionsDto options;
	
}
