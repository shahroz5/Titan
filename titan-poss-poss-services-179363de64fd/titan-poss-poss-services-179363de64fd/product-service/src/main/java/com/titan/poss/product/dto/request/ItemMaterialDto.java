/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.util.Set;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemMaterialDto {
	private Set<AddItemMaterialMappingDto> addMaterials;

	private Set<String> removeMaterials;

}