/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.util.Set;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemStoneDto {
	@NotNull(message = "Please provide the add stones")
	private Set<AddItemStoneMappingDto> addStones;

	@NotNull(message = "Please provide the remove stones")
	private Set<String> removeStones;

}
