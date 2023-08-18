/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Size;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Gift Card Product Dto")
@Data
public class PaymentProductDto {
	
	@ApiModelProperty(position = 1, value = "Id", name = "id", required = false, example = "")
	private String id;

	@Size(min = 1, max = 50, message = "paymentCategoryName min length {min} and max length is {max}")
	@ApiModelProperty(position = 1, value = "Name of the Payment Category", name = "paymentCategoryName", required = true, example = "QC_Tanishq EC eGift Card")
	private String paymentCategoryName;

	@ApiModelProperty(position = 3, value = "Product group code", name = "productGroupCode", required = false, example = "73")
	private String productGroupCode;

}
