/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.integration.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Airpay Verify Response Dto")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class AirpayVerifyResponseDto {

	@ApiModelProperty(position = 1, value = "success", name = "success", example = "200")
	private String transacionStatus;

	@JsonIgnore
	private String message;

	@ApiModelProperty(position = 2, value = "invoiveNumber", name = "invoiveNumber", example = "12345")
	private String vendorPaymentId;

	@ApiModelProperty(position = 3, value = "phone", name = "phone", example = "URB123")
	private String transactionId;

	@ApiModelProperty(position = 4, value = "success", name = "success", example = "100")
	private String amount;

	@JsonIgnore
	private String vendorSecureHash;

	@JsonIgnore
	private String customerVar;

	@JsonIgnore
	private String cardCountry;

	@ApiModelProperty(position = 7, value = "paymentCode", name = "paymentCode", example = "nb(net banking)")
	private String paymentCode;

	@JsonIgnore
	private String conversionRate;

	@ApiModelProperty(position = 8, value = "bankName", name = "bankName", example = "HDFC")
	private String bankName;

	@JsonIgnore
	private String cardIssuer;

	@ApiModelProperty(position = 9, value = "cardType", name = "cardType", example = "DEBIT")
	private String cardType;

	@JsonIgnore
	private String customer;

	@JsonIgnore
	private String customerEmail;

	@JsonIgnore
	private String customerPhone;

	@JsonIgnore
	private String currencyCode;

	@JsonIgnore
	private String risk;

	@ApiModelProperty(position = 10, value = "transactionType", name = "transactionType", example = "true")
	private String transactionType;

	@ApiModelProperty(position = 11, value = "transactionTime", name = "transactionTime", example = "02-07-2020 17:04:56")
	private String transactionTime;

	@JsonIgnore
	private String cardNumber;

	@ApiModelProperty(position = 12, value = "responseMesssage", name = "responseMesssage", example = "SUCCESS")
	private String responseMesssage;

	@ApiModelProperty(position = 13, value = "merchantName", name = "merchantName", example = "Tanishq")
	private String merchantName;

	@ApiModelProperty(position = 14, value = "walletBalance", name = "walletBalance", example = "100")
	@JsonIgnore
	private String walletBalance;

	@JsonIgnore
	private String surcharge;

	@JsonIgnore
	private String settlementDate;

	@JsonIgnore
	private String billedAmount;

	@ApiModelProperty(position = 15, value = "failureReason", name = "failureReason", example = "PaymentStatus:Insufficient Funds")
	private String failureReason;

	@JsonIgnore
	private String rrNumber;
}
