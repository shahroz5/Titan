/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.service.clients.ProductServiceClient;
import com.titan.poss.location.service.ProductService;

/**
 * Service class for Products.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("locationProductService")
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductServiceClient productServiceClient;

	@Override
	public ProductGroupDto getProductGroup(String productGroupCode) {
		return productServiceClient.getProductGroup(productGroupCode);
	}

}
