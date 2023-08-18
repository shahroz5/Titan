/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.math.BigDecimal;
import java.util.Set;
import java.util.List;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountProductGroupDto {

	private BigDecimal eligibleKarat;

	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> addProducts;
	
	private List<UpdateProductGroups> updateProductGroupsDtoList; 
	
    @Valid
    private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> updateProducts;
	
	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeProducts;
	
	private Boolean isActive;

}
