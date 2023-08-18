/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request.gc;

import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;

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
@ApiModel(description = "Gift Card reverse redeem request Dto")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class GiftCardReverseRedeemRequestDto extends GiftCardBaseReverseRedeemRequestDto {

	@ApiModelProperty(position = 2, value = "Track data", name = "trackData", example = "19800716401100030091102155")
	private String trackData;

	@ApiModelProperty(position = 7, value = "Notes", name = "notes", example = "{ValType~GCACT}")
	private String notes;

}
