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
@ApiModel(description = "Gift card cancel activate Dto")
@Data
public class GiftCardBaseCancelActivateDto {

	@ApiModelProperty(position = 1, value = "Card Number", name = "cardNumber", example = "9807641100001121")
	@Size(max = 50, message = "card number max length is {max}")
	private String cardNumber;
	
	@ApiModelProperty(position = 2, value = "Track data", name = "trackData", example = "19800716401100030091102155")
	@Size(max = 37, message = "track data max length is {max}")
	private String trackData;
	
	@ApiModelProperty(position = 4, value = "originalAmount", name = "originalAmount", example = "1")
	private String originalAmount;
	
	@ApiModelProperty(position = 5, value = "originalInvoiceNumber", name = "originalInvoiceNumber", example = "INV-05112022")
	private String originalInvoiceNumber;
	
	@ApiModelProperty(position = 6, value = "OriginalTransactionId", name = "originalTransactionId", example = "12432")
	private String originalTransactionId;
	
	@ApiModelProperty(position = 7, value = "originalBatchNumber", name = "originalBatchNumber", example = "12345")
	private String originalBatchNumber;
	
	@ApiModelProperty(position = 8, value = "originalApprovalCode", name = "originalApprovalCode", example = "12345")
	private String originalApprovalCode;
	
}
