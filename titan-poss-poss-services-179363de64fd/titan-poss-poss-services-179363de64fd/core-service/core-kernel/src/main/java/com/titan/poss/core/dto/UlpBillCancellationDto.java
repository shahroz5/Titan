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

@ApiModel(description = "ULP Bill Cancellation Dto")
@Data
public class UlpBillCancellationDto {

	@ApiModelProperty(position = 1, value = "Loyalty Card Number", name = "ulpId", required = true, example = "700001964929")
	@PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, message = "Invalid Ulp Id", nullCheck = true)
	private String ulpId;

	@ApiModelProperty(position = 2, value = "Inovice Cancel Date", name = "invoiceCancelDate", required = true, example = "2020-06-04T05:33:11.946Z")
	private Date invoiceCancelDate;

	@ApiModelProperty(position = 3, value = "Type of Discount", name = "discountType", required = true, example = "ANNIVERSARY")
	@ValueOfEnum(enumClass = UlpDiscountType.class)
	private String discountType;

	@ApiModelProperty(position = 4, value = "Transaction Id which was used while availing discount", name = "transactionId", required = true, example = "URB1")
	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX, message = "Invalid transaction id", nullCheck = true)
	private String transactionId;

}
