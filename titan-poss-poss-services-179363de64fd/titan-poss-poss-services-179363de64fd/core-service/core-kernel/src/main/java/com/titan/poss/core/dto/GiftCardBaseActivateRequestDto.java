/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Gift Card Activate request Dto")
@Data
public class GiftCardBaseActivateRequestDto {

	@ApiModelProperty(position = 1, value = "Card Number", name = "cardNumber", example = "9807641100001121")
	@Size(max = 50, message = "card number max length is {max}")
	private String cardNumber;

	@ApiModelProperty(position = 2, value = "Track data", name = "trackData", example = "19800716401100030091102155")
	@Size(max = 37, message = "track data max length is {max}")
	private String trackData;

	@ApiModelProperty(position = 4, value = "Amount", name = "amount", example = "1000")
	private String amount;

	@ApiModelProperty(position = 5, value = "InvoiceNumber", name = "invoiceNumber", example = "INV-05112022")
	@Size(max = 50, message = "invoice number max length is {max}")
	private String invoiceNumber;

}
