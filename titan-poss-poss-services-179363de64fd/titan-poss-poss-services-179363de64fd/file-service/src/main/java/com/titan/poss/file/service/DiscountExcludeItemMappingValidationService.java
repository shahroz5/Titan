/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.file.dto.DiscountExcludeItemMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface DiscountExcludeItemMappingValidationService {

//	boolean dataValidation(DiscountExcludeItemMappingDto item);

	/**
	 * @param item
	 * @param discountId
	 * @return
	 */
	boolean dataValidation(DiscountExcludeItemMappingDto item);
}
