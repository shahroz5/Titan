/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import lombok.Data;

/**
 * Count DTO for Stocks, Requests and Invoices
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class InventoryCountDto {

	String type;

	Long count;

	public InventoryCountDto(String type, Long count) {
		super();
		this.type = type;
		this.count = count;
	}

}
