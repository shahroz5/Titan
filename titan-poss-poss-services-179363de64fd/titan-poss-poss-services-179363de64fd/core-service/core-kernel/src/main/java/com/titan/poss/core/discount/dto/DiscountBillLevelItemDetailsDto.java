/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountBillLevelItemDetailsDto {

	@PatternCheck(regexp = RegExConstants.DISCOUNT_CODE_REGEX, nullCheck = true)
	private String discountCode;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String discountId;

	@ValueOfEnum(message = "Invalid discount type", enumClass = DiscountTypeEnum.class, nullCheck = true)
	private String discountType;

	@PositiveOrZero(message = "Value must be positive or Zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal discountValue;

	private JsonData discountValueDetails;

	private List<@Valid DiscountItemsDto> itemDetails;

	private BaseBasicCriteriaDetails basicCriteriaDetails;

	private ClubbingConfigDetails clubbingDetails;

	private Boolean isEdited;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String refPaymentId;
}
