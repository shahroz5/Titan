/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ProductGroupUpdateDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250)
	private String description;

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX)
	private String itemTypeCode;

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX)
	private String orgCode;

	private JsonData configDetails;

	private JsonData pricingDetails;

	private Boolean isActive;

	private Boolean isMia;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_PLAIN_STUDDED_REGEX)
	private String plainStudded;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_PLAIN_STUDDED_REGEX)
	private String plainStuddedTep;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_PLAIN_STUDDED_REGEX)
	private String plainStuddedGrn;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_PLAIN_STUDDED_REGEX)
	private String plainStuddedGrf;

	@PatternCheck(regexp = RegExConstants.PRICING_TYPE)
	private String pricingType;

}
