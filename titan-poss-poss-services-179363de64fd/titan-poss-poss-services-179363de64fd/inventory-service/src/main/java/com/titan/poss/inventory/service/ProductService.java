/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service;

import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.dto.ProductCategoryDto;
import com.titan.poss.core.dto.ProductGroupDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface ProductService {

	ConversionItemDto getItemDetailsForConversionFromProductService(String itemCode, String lotNumber);

	/**
	 * @param itemCode
	 * @return
	 */
	ConversionItemDto getItemMasterForConversion(String itemCode);

	/**
	 * @param itemCode
	 * @return
	 */
	ProductGroupDto getProductGroup(String productGroupCode);

	/**
	 * @param productCategoryCode
	 * @return
	 */
	ProductCategoryDto getProductCategory(String productCategoryCode);

}
