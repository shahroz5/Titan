/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class AddDiscountProductGroupMappingDto {

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX)
	private String productGroupCode;

}
