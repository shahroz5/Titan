/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
*
* @author Mindtree Ltd.
* @version 1.0
*/

@ApiModel(description = "REDEEM POINTS DTO")
@Data
@EqualsAndHashCode(callSuper=false)
public class RedeemPointsDto extends UlpBaseResponseDto{

	@ApiModelProperty(position = 1, value = "Reference number", name = "redemptionReferenceNumber", required = false, example = "1234567")
	private String redemptionReferenceNumber;

	@ApiModelProperty(position = 2, value = "Otp sent to the customer which will be verified by us", name = "authorizationCode", required = false, example = "1234")
	private String authorizationCode;

	@ApiModelProperty(position = 3, value = "Redemtion Process Flag", name = "redemtionProcessFlag", required = false, example = "1")
	private String redemtionProcessFlag;

	@ApiModelProperty(position = 4, value = "Balance Points", name = "balancePoints", required = false, example = "900")
	private String balancePoints;

}
