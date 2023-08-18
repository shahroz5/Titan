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
public class RazorpayResponseDto {

	@JsonProperty("accept_partial")
	private boolean acceptPartial;

	private Integer amount;

	@JsonProperty("amount_paid")
	private Integer amountPaid;

	@JsonProperty("cancelled_at")
	private long cancelledAt;

	@JsonProperty("created_at")
	private long createdAt;

	private String currency;

	@JsonProperty("reference_id")
	private String referenceId;

	private RazorpayCustomerDto customer;

	private String description;

	@JsonProperty("expire_by")
	private long expireBy;

	@JsonProperty("expire_at")
	private long expireAt;

	@JsonProperty("first_min_partial_amount")
	private Integer firstMinPartialAmount;

	private String id;

	private String notes;

	private RazorpayNotifyRequestDto notify;

	@JsonProperty("reminder_enable")
	private Boolean reminderEnable;

	@JsonProperty("short_url")
	private String shortUrl;

	private String status;

	@JsonProperty("updated_at")
	private long updatedAt;

	@JsonProperty("upi_link")
	private Boolean upiLink;

	@JsonProperty("user_id")
	private String userId;
	
	@JsonProperty("order_id")
	private String orderId;
	
	private List<RazorpayPaymentDetailsResponseDto> payments;

	private String errorCode;
	
	private String errorMessage;

}
