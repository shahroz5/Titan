/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ProductCategoryDto {

	@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX, nullCheck = true)
	private String productCategoryCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250, nullCheck = true)
	private String description;

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX)
	private String orgCode;

	private Boolean isActive;
	
	@NotNull(message = "hallmarkDetails cannot be null")
	private JsonData hallmarkDetails;
	
	private Integer hallmarkQuantity;
	
	private Boolean isConversionEnabled;

}
