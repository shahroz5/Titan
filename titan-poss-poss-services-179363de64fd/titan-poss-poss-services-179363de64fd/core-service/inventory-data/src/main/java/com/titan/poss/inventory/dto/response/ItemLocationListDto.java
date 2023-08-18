/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemLocationListDto {

	private String locationcode;
	private Long quantity;
	private String itemCode;

	public ItemLocationListDto(String locationcode, Long quantity, String itemCode) {
		this.locationcode = locationcode;
		this.quantity = quantity;
		this.itemCode = itemCode;
	}

}
