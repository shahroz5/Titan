/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.MetalRateListDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GoodExchangeRequestConfirmDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;

	@Valid
	private MetalRateListDto metalRateList;

	@NotNull(message = "Please provide Total Weight")
	@Positive(message = "Total weight should be greater than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Total Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalWeight;

	@NotNull(message = "Please provide Total Weight")
	@Positive(message = "Total value must be greater than 0")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total Value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalValue;
	
	private JsonData refundDetails;
	
	@ValueOfEnum(enumClass = DiscountTypeEnum.class)
	private String discountTypeSelected;
	
}
