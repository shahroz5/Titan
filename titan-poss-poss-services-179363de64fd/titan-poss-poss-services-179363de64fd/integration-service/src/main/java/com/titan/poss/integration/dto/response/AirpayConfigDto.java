/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AirpayConfigDto {

	@JsonIgnore()
	private String locationCode;
	
	@JsonProperty("MerchantId")
	private String merchantId;
	
	@JsonProperty("Username")
	private String username;

	@JsonProperty("Password")
	private String password;
	
	@JsonProperty("SecretKey")
	private String secretKey;
	
	@JsonProperty("SecretToken")
	private String secretToken;

}
