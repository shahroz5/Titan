/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.dto.ProductCategoryDto;
import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.service.clients.ProductServiceClient;
import com.titan.poss.inventory.service.ProductService;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service
public class ProductServiceImpl implements ProductService {
	// Call to Product ProductGroupService
	@Autowired
	ProductServiceClient productClient;

	@Override
	public ConversionItemDto getItemDetailsForConversionFromProductService(String itemCode, String lotNumber) {
		return productClient.getItemDetailsForConversionFromProductService(itemCode, lotNumber);
	}

	@Override
	public ConversionItemDto getItemMasterForConversion(String itemCode) {
		return productClient.getItemMasterForConversion(itemCode);
	}

	@Override
	public ProductGroupDto getProductGroup(String productGroupCode) {
		return productClient.getProductGroup(productGroupCode);
	}

	@Override
	public ProductCategoryDto getProductCategory(String productCategoryCode) {
		return productClient.getProductCategory(productCategoryCode);
	}

}
