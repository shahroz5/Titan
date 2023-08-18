/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.integration.dto.request.RazorpayCustomerDto;
import com.titan.poss.integration.dto.request.RazorpayNotifyRequestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderPaymentsResponseDto {
	
	@JsonProperty("error_code")
	private String errorCode;
	
	@JsonProperty("error_description")
	private String errorDescription;
	
}
