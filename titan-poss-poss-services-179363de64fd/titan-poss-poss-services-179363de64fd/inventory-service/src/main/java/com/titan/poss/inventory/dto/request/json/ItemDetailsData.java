/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request.json;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Valid
@NoArgsConstructor
@AllArgsConstructor
public class ItemDetailsData {

	@NotNull(message = "remarks cannot be null")
	@NotBlank(message = "remarks cannot be empty")
	String remarks;

	@NotNull(message = "itemCode cannot be null")
	@NotBlank(message = "itemCode cannot be empty")
	String itemCode;

	@NotNull(message = "netWeight cannot be null")
	@NotBlank(message = "netWeight cannot be empty")
	String netWeight;

//	@NotNull(message = "stonePrice cannot be null")
//	@NotEmpty(message = "stonePrice cannot be empty")
	String stonePrice;

	@NotNull(message = "complexityCode cannot be null")
	@NotBlank(message = "complexityCode cannot be empty")
	String complexityCode;

	@NotNull(message = "sold cannot be null")
	@NotBlank(message = "sold cannot be empty")
	String sold;

	@NotNull(message = "itemType cannot be null")
	@NotBlank(message = "itemType cannot be empty")
	String itemType;

}
