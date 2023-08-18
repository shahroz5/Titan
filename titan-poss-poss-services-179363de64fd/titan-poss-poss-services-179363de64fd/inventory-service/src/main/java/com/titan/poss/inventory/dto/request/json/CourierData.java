/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request.json;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class for update of Other Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Valid
public class CourierData {

	@PatternCheck(regexp = RegExConstants.COURIER_NAME_REGEX, nullCheck = true)
	private String companyName;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX, nullCheck = true)
	private String docketNumber;

//	@PatternCheck(regexp = RegExConstants.ROAD_PERMIT_REGEX, nullCheck = true)
	private String roadPermitNumber;

	@PositiveOrZero(message = "Number of boxes should be greater than 0")
	private Integer numberOfBoxes;

	@Valid
	private List<BoxDetails> boxDetails;

}
