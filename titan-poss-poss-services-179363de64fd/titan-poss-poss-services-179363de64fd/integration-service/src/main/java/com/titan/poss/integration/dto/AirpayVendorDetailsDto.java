/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class AirpayVendorDetailsDto extends BaseFieldsValidator {
	
	@JsonProperty("CreatePaymentUrl")
	private String createPaymentUrl;
	
	@JsonProperty("VerifyPaymentUrl")
	private String verifyPaymentUrl;

}
