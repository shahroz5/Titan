/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * The Class RedeemLoyaltyPointsDto.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "ULP Reverse Redeemed Loyalty Points Dto")
@Data
public class UlpReverseRedeemedLoyaltyPointsDto {

	@ApiModelProperty(position = 1, value = "Loyalty Card Number", name = "ulpId", required = false, example = "700001964929")
	@PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, message = "Invalid Ulp Id", nullCheck = true)
	private String ulpId;
	
	@ApiModelProperty(position = 2, value = "Redeemed points to be reversed", name = "redeemedPoints", required = false, example = "100")
	private Integer redeemedPoints;	
	
	@ApiModelProperty(position = 3, value = "Reference Number", name = "refernceNumber", required = false, example = "1004324")
	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX, message = "Invalid reference number", nullCheck = true)
	private String refernceNumber;	
}
