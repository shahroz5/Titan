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
@ApiModel(description = "Gift card customer Response Dto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class GcCustomerResponseDto {

	@ApiModelProperty(position = 1, value = "firstName", name = "firstName", example = "Firstname")
	private String firstName;

	@ApiModelProperty(position = 2, value = "phone", name = "phone", example = "8105672851")
	private String phone;

	@ApiModelProperty(position = 3, value = "Card number", name = "cardNumber", example = "9807641100001121")
	private String cardNumber;

	@ApiModelProperty(position = 4, value = "cardBalance", name = "cardBalance", example = "3999")
	private String cardBalance;

	@ApiModelProperty(position = 5, value = "cardStatus", name = "cardStatus", example = "Activated")
	private String cardStatus;

	@ApiModelProperty(position = 6, value = "cardProgramGroupName", name = "cardProgramGroupName", example = "QC_Tanishq EC eGift Card")
	private String cardProgramGroupName;

	@ApiModelProperty(position = 7, value = "cardExpiryDate", name = "cardExpiryDate", example = "31-12-2020")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date cardExpiryDate;

	@ApiModelProperty(position = 8, value = "Response Code", name = "responseCode", example = "0")
	private String responseCode;

	@ApiModelProperty(position = 9, value = "Response Message", name = "responseMessage", example = "Transaction successful.")
	private String responseMessage;
}
