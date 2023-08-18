/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class AddItemMaterialMappingDto {

	private String materialCode;

	private BigDecimal noOfMaterials;

	private Boolean isActive;
}
