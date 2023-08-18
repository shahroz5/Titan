/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BrandDto {

	@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX, nullCheck = true)
	private String brandCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_100, nullCheck = true)
	private String description;

	@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX)
	private String parentBrandCode;

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX)
	private String orgCode;

	private JsonData configDetails;

	private JsonData customerDetails;
	
	private JsonData panCardDetails;

	private JsonData taxDetails;
	
	private JsonData brandTcsDetails;

	private JsonData cmDetails;

	private Boolean isActive;

}
