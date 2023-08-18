/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.request;

import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class GepUpdateDto {

	@Positive(message = "customer id should be more than 0")
	private Integer customerId;

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX)
	private String employeeCode;

	private JsonData exchangeDetails;
}
