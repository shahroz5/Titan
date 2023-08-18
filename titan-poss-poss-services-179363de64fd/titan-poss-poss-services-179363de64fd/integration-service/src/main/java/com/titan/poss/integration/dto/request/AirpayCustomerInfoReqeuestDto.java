/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Builder(toBuilder = true)
public class AirpayCustomerInfoReqeuestDto {

	@JsonProperty("FIRST_NAME")
	private String firstName;
	
	@JsonProperty("LAST_NAME")
	private String lastName;
	
	@JsonProperty("EMAIL")
    private String emailId;
	
	@JsonProperty("PHONE")
	private String phone;
}
