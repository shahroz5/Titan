/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BrandUpdateDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_100)
	private String description;

	@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX)
	private String parentBrandCode;

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX)
	private String orgCode;

	private JsonData configDetails;

	private JsonData customerDetails;
	
	private JsonData panCardDetails;

	private JsonData taxDetails;

	private JsonData cmDetails;

	private Boolean isActive;
	
	private JsonData brandTcsDetails;

}
