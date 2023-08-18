/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request.gc;

import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Gift Card redeem request Dto")
@Data
@EqualsAndHashCode(callSuper=false)
public class GiftCardRedeemRequestDto extends GiftCardBaseRedeemRequestDto{

	@ApiModelProperty(position = 7, value = "Notes", name = "notes", example = "{ValType~GCACT}")
	private String notes;
	
}
