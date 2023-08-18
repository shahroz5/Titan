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
@ApiModel(description = "ULP Redeem Loyalty Points Dto")
@Data
public class UlpRedeemLoyaltyPointsDto {

	@ApiModelProperty(position = 1, value = "Loyalty Card Number", name = "ulpId", required = true, example = "700001964929")
	@PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, message = "Invalid Ulp Id", nullCheck = true)
	private String ulpId;
	
	@ApiModelProperty(position = 2, value = "Points to be redeemed", name = "redeemedPoints", required = true, example = "100")
	private Integer redeemedPoints;	
}
