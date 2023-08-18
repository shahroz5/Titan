/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

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
@ApiModel(description = "Gift card Activate Response Dto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class GcActivateResponseDto {

	@ApiModelProperty(position = 1, value = "Amount", name = "amount", example = "3997")
	private String amount;

	@ApiModelProperty(position = 2, value = "Card number", name = "cardNumber", example = "9807641100001121")
	private String cardNumber;

	@ApiModelProperty(position = 3, value = "Card type", name = "cardType", example = "Physical")
	private String cardType;

	@ApiModelProperty(position = 4, value = "Card Name", name = "cardName", example = "Tanishq Retail Gift Card")
    private String cardName;

	@ApiModelProperty(position = 5, value = "Card Expiry date", name = "cardEexpiryDate", example = "2020-12-31T00:00:00")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date cardExpiryDate;

	@ApiModelProperty(position = 6, value = "Response Code", name = "responseCode", example = "0")
	private String responseCode;

	@ApiModelProperty(position = 7, value = "Response Message", name = "responseMessage", example = "Transaction successful.")
	private String responseMessage;

	@ApiModelProperty(position = 8, value = "Approval code", name = "approvalCode", example = "123456")
	private String approvalCode;

	@ApiModelProperty(position = 9, value = "Invoice Number", name = "invoiceNumber", example = "INV-123456")
	private String invoiceNumber;

	@ApiModelProperty(position = 10, value = "Batch Number", name = "batchNumber", example = "123456")
	private String batchNumber;

	@ApiModelProperty(position = 11, value = "Transaction Id", name = "transactionId", example = "12345")
	private String transactionId;
}
