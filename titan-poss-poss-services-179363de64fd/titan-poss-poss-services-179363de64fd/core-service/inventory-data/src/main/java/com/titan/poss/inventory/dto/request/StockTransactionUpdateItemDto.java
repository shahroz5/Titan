/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StockTransactionUpdateItemDto {

	@NotNull(message = "measuredWeight cannot be null")
	@Positive(message = "measuredWeight should be greater than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Measured Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal measuredWeight;
}
