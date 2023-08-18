/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PaymentHostNameDto {

	@JsonProperty("locationCode")
	private String locationCode;

	@JsonProperty("hostName")
	private String hostName;

	@JsonProperty("deviceId")
	private String deviceId;

	@JsonProperty("paymentCode")
	private String paymentCode;

	@JsonProperty("isActive")
	private String isActive;
}
