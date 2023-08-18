/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.Set;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ProductCategoryUpdateDto {

	private Set<String> addProductCategories;
	
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> updateProductCategories;
	
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeProductCategories;
	
    private Boolean isActive;
}
