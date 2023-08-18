/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.service;

import com.titan.poss.core.dto.ProductGroupDto;

/**
 * Service interface for Products.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface ProductService {

	/**
	 * This method will get the product group code details.
	 * 
	 * @param productGroupCode
	 * @return ProductGroupDto
	 */
	ProductGroupDto getProductGroup(String productGroupCode);

}
