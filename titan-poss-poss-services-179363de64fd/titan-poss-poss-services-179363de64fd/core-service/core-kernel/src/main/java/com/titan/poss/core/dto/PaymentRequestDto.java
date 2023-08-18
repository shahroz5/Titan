/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Payment Request Dto")
@Data
public class PaymentRequestDto {

	@ApiModelProperty(position = 1, value = "customerName", name = "customerName", example = "Some name")
	@Size(min = 2, max = 50, message = "customerName min length {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = true)
	private String customerName;

	@ApiModelProperty(position = 2, value = "Email Id", name = "emailId", required = false, example = "abc@gmail.com")
	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX, nullCheck = false)
	private String emailId;

	@ApiModelProperty(position = 3, value = "mobileNumber", name = "mobileNumber", example = "8105672851")
	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX, message = "Invalid phone number", nullCheck = false)
	private String mobileNumber;

	@ApiModelProperty(position = 4, value = "amount", name = "amount", example = "100")
	private String amount;

	@ApiModelProperty(position = 5, value = "transactionId", name = "transactionId", example = "URB12")
	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX, message = "Invalid transaction id",  nullCheck = false)
	private String transactionId;
	
	@ApiModelProperty(position = 6, value = "currency", name = "currency", example = "INR")
	@PatternCheck(regexp = RegExConstants.CURRENCY_CODE_REGEX, message = "Invalid currenct",  nullCheck = false)
	private String currency;
}
