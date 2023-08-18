/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.util.Set;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemLiteRequestDto {

	private Set<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> includeProductGroups;

	private Set<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> excludeProductGroups;

	private Set<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> includeProductCategories;

	private Set<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> excludeProductCategories;

	private Boolean isFocItem;

}
