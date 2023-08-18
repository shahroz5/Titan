/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;


import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.constant.enums.UlpDiscountType;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Ulp Discount response Dto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class UlpDiscountResponseDto extends UlpBaseResponseDto {

	@ApiModelProperty(position = 1, value = "Loyalty Card Number", name = "ulpId", required = false, example = "700001964929")
    private String ulpId;
	
	@ApiModelProperty(position = 2, value = "Type of Discount", name = "discountType", required = false, example = "ANNIVERSARY")
	@ValueOfEnum(enumClass = UlpDiscountType.class)
	private String discountType;
    
    @ApiModelProperty(position = 3, value = "Date of transaction", name = "transactionDate", example = "05-Jun-2020")
	@JsonFormat(pattern = "dd-MMM-yyyy")
    private Date transactionDate;
    
    @ApiModelProperty(position = 4, value = "Transaction Id", name = "transactionId", example = "URB1")
    private String transactionId;
}
