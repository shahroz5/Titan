/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ItemDto {

	private String itemCode;

	@JsonProperty("productCategoryCode")
	private String productCategory;

	@JsonProperty("productGroupCode")
	private String productGroup;

}
