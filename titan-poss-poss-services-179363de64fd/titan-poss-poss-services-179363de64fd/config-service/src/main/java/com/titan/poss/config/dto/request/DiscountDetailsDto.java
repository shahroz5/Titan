/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.List;

import javax.validation.constraints.Size;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountDetailsDto {

	@Size(min = 0, max = 5)
	private List<JsonData> discountComponents;

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> updateDetails;

	private Boolean isActive;

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeDetails;

	private List<JsonData> configDetails;

	private String discountPercent;
}
