/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * Request DTO for Discount updates
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountItemUpdateDto {

	@Positive(message = "Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal discountValue;

	private JsonData discountValueDetails;

	@NotNull
	private Boolean isEdited;

}
