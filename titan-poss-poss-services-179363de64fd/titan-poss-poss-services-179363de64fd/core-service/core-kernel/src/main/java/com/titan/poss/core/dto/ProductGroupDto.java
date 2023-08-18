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
public class ProductGroupDto {

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX, nullCheck = true)
	private String productGroupCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250, nullCheck = true)
	private String description;

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX)
	private String itemTypeCode;

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX)
	private String orgCode;

	@NotNull(message = "configDetails cannot be null")
	private JsonData configDetails;

	@NotNull(message = "configDetails cannot be null")
	private JsonData pricingDetails;

	@NotNull(message = "isActive cannot be null")
	private Boolean isActive;

	@NotNull(message = "isMia cannot be null")
	private Boolean isMia;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_PLAIN_STUDDED_REGEX, nullCheck = true)
	private String plainStudded;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_PLAIN_STUDDED_REGEX, nullCheck = true)
	private String plainStuddedTep;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_PLAIN_STUDDED_REGEX, nullCheck = true)
	private String plainStuddedGrn;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_PLAIN_STUDDED_REGEX, nullCheck = true)
	private String plainStuddedGrf;

	@PatternCheck(regexp = RegExConstants.PRICING_TYPE, nullCheck = true)
	private String pricingType;


}
