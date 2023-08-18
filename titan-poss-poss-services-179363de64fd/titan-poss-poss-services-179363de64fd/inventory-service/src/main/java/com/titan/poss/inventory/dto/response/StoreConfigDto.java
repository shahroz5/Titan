/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.util.Map;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class StoreConfigDto {

	private Map<String, ProductCategoryDto> productCategories;

}
