/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class AddExchangeConfigProductDto {

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX, nullCheck = true)
	private String productGroupCode;

	private JsonData configDetails;// only for TEP
}
