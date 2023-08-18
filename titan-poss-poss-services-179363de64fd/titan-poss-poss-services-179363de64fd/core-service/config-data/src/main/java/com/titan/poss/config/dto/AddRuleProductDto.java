/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class AddRuleProductDto {

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX)
	private String productGroupCode;

	@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX)
	private String productCategoryCode;

	private JsonData ruleDetails;

	private String rangeId;
	
	private Integer rowId;

}
