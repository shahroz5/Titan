/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DiscountProductGroupMappingDto {

	private String productGroup;

	private String karatType; // or product type

	private String productType;

}
