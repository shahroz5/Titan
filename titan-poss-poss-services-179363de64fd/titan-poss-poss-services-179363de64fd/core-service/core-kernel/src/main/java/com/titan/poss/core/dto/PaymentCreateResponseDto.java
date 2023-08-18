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
@ApiModel(description = "Payment Create Response Dto")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class PaymentCreateResponseDto {

	@ApiModelProperty(position = 1, value = "success", name = "success", example = "true")
	private String status;
	
	@ApiModelProperty(position = 2, value = "transactionId", name = "transactionId", example = "URB12345")
    private String transactionId;
	
	@ApiModelProperty(position = 3, value = "paymentUrl", name = "paymentUrl", example = "https://tanishqposs.invoicepay.co.in/invoice/MTI1NTM2NDk=")
	private String paymentUrl;
	
	@ApiModelProperty(position = 4, value = "errorMessage", name = "errorMessage", example = "")
	private String errorMessage;

}
