/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ConversionApprovalRequestDto {

	@PatternCheck(regexp = RegExConstants.USER_NAME_REGEX, nullCheck = true)
	private String rsoName;

}
