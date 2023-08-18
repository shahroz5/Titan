/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request.gc;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Gift Card balance request Dto")
@Data
public class GiftCardBalanceRequestDto {

	@ApiModelProperty(position = 1, value = "Card Number", name = "cardNumber", example = "9807641100001121")
	private String cardNumber;
	
	@ApiModelProperty(position = 2, value = "Track data", name = "trackData", example = "19800716401100030091102155")
	private String trackData;
	
	@ApiModelProperty(position = 3, value = "Transaction Id", name = "transactionId", example = "12345")
	private String transactionId;
	
	@ApiModelProperty(position = 4, value = "Notes", name = "notes", example = "{ValType~GCACT}")
	private String notes;
	
}
