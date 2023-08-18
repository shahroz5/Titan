/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.core.dto;

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
@ApiModel(description = "Payment Verify Response Dto")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerifyResponseDto {

	@ApiModelProperty(position = 1, value = "success", name = "success", example = "200")
	private String transacionStatus;

	@ApiModelProperty(position = 2, value = "invoiveNumber", name = "invoiveNumber", example = "12345")
	private String vendorPaymentId;

	@ApiModelProperty(position = 3, value = "phone", name = "phone", example = "URB123")
	private String transactionId;

	@ApiModelProperty(position = 4, value = "success", name = "success", example = "100")
	private String amount;

	@ApiModelProperty(position = 7, value = "paymentCode", name = "paymentCode", example = "nb(net banking)")
	private String paymentCode;

	@ApiModelProperty(position = 12, value = "responseMesssage", name = "responseMesssage", example = "SUCCESS")
	private String responseMesssage;
	
	@ApiModelProperty(position = 13, value = "errorCode", name = "errorCode", example = "BAD_REQUEST_ERROR")
	private String errorCode;

}
