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
public class ProductCategoryDto {

	private String productCategoryCode;
	private Map<String, ProductGroupDto> productGroups;

}
