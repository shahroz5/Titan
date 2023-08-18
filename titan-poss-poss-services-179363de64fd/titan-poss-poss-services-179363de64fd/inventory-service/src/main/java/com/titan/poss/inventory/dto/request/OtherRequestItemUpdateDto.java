/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO Class to update the quantity of other request item
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class OtherRequestItemUpdateDto {

	@Positive
	private Short quantity;

	@Positive
	private BigDecimal measuredWeight;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String inventoryId;

}
