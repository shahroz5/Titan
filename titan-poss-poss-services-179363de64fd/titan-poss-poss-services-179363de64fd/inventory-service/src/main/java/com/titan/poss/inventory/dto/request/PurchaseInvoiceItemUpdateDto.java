/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.inventory.validator.PurchaseInvoiceItemUpdateDtoConstraint;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@PurchaseInvoiceItemUpdateDtoConstraint
public class PurchaseInvoiceItemUpdateDto {
	@NotNull
	@Positive(message = "measured weight should be more than 0")
	private BigDecimal measuredWeight;

	@PatternCheck(regexp = RegExConstants.BIN_REGEX, nullCheck = true)
	private String binCode;

	@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX, nullCheck = true)
	private String binGroupCode;

	private JsonData itemDetails;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String remarks;
}
