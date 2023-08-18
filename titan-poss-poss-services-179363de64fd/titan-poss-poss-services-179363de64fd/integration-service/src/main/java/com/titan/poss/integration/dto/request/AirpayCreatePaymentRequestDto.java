/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import lombok.Builder;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Airpay Create Payment Request Dto")
@Data
@Builder(toBuilder = true)
public class AirpayCreatePaymentRequestDto {

	@JsonProperty("MERCHANT_ID")
	private String merchantId;

	@JsonProperty("customer")
	private AirpayCustomerInfoReqeuestDto customer;

	@JsonProperty("INVOICE_NUMBER")
	private String invoiveNumber;

	@JsonProperty("TOTAL_AMOUNT")
	private String totalAmount;

	@JsonProperty("SEND_REQUEST")
	private AirpaySendRequestDto sendRequest;
}
