/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GiftCardBaseRedeemRequestDto {

	@ApiModelProperty(position = 1, value = "Card Number", name = "cardNumber", example = "9807641100001121")
	@PatternCheck(regexp = RegExConstants.GIFT_CARD_NUMBER_REGEX, message = "Invalid gift card number", nullCheck = false)
	private String cardNumber;
	
	@ApiModelProperty(position = 2, value = "Track data", name = "trackData", example = "1980071640110003009110")
	@PatternCheck(regexp = RegExConstants.TRACK_DATA_REGEX, message = "Invalid track data", nullCheck = false)
	private String trackData;
	
	@ApiModelProperty(position = 3, value = "Card Id", name = "cardPin", example = "12345")
	@PatternCheck(regexp = RegExConstants.GIFT_CARD_PIN_REGEX, message = "Invalid gift card pin", nullCheck = false)
	private String cardPin;
	
	@ApiModelProperty(position = 4, value = "InvoiceNumber", name = "invoiceNumber", example = "INV-05112022")
	@Size(max = 50, message = "invoice number max length is {max}")
	private String invoiceNumber;
	
	@ApiModelProperty(position = 5, value = "Amount", name = "amount", example = "1")
	@Digits(integer = 10 , fraction = 2, message = "invalid amount")
	private Double amount;
	
	@ApiModelProperty(position = 6, value = "Bill Amount", name = "billAmount", example = "1000")
	@Digits(integer = 10 , fraction = 2, message = "invalid bill amount")
	private Double billAmount;
}
