/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import javax.validation.constraints.Digits;

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
@ApiModel(description = "Gift Card reverse redeem request Dto")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class GiftCardBaseReverseRedeemRequestDto {

	@ApiModelProperty(position = 1, value = "Card Number", name = "cardNumber", example = "9807641100001121")
	private String cardNumber;

	@ApiModelProperty(position = 3, value = "InvoiceNumber", name = "invoiceNumber", example = "INV-05112022")
	private String invoiceNumber;

	@ApiModelProperty(position = 4, value = "Amount", name = "amount", example = "1")
	@Digits(integer = 10, fraction = 2, message = "invalid amount")
	private Double amount;

	@ApiModelProperty(position = 5, value = "Bill Amount", name = "billAmount", example = "1000")
	@Digits(integer = 10, fraction = 2, message = "invalid bill amount")
	private Double billAmount;

	@ApiModelProperty(position = 6, value = "transactionId", name = "transactionId", example = "12345")
	private String transactionId;

}
