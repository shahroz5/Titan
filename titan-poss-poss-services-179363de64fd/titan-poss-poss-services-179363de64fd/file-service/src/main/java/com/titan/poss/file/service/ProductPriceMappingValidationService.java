/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.file.dto.ProductPriceMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ProductPriceMappingValidationService {

	
	boolean dataValidation(ProductPriceMappingDto item);

}
