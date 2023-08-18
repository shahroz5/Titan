/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ProductCategoryUpdateResponseDto {

	private String id;

	private String productCategoryCode;
	
	private String description;

	private Boolean isActive;
}
