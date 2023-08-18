/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.util.Date;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.UlpDiscountType;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@ApiModel(description = "ULP Discount Dto")
@Data
public class UlpDiscountDto {

	@ApiModelProperty(position = 1, value = "Loyalty Card Number", name = "ulpId", required = false, example = "700001964929")
	@PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, message = "Invalid Ulp Id", nullCheck = false)
	private String ulpId;
	
	@ApiModelProperty(position = 2, value = "Type of Discount", name = "discountType", required = false, example = "ANNIVERSARY")
	@ValueOfEnum(enumClass = UlpDiscountType.class)
	private String discountType;
	
	@ApiModelProperty(position = 3, value = "Inovice Date", name = "invoiceDate", required = false, example = "2000-06-04T05:33:11.946Z")
	private Date invoiceDate;

}

