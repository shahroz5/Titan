/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.Set;

import lombok.Data;
import com.titan.poss.core.domain.validator.PatternCheck;
import javax.validation.Valid;
import com.titan.poss.core.domain.constant.RegExConstants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RivaahProductMappingDto {

	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> addProducts;

	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeProducts;

}
