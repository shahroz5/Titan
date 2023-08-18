/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Map;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Positive;

import com.titan.poss.core.discount.dto.CummulativeDiscountWithExcludeDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.constants.DiscountReferenceTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class for discount details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountDetailDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String discountCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String discountType;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String discountId;

	@Positive(message = "Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal discountValue;

	private JsonData discountValueDetails;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String referenceId;

	@ValueOfEnum(enumClass = DiscountReferenceTypeEnum.class)
	private String referenceType;

	private Boolean isEdited;

	private Boolean isAutoApplied;

	@PatternCheck(regexp = RegExConstants.REASON_REGEX)
	private String reason;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String clubbedDiscountId;

	private String cumulativeDiscountId;

	private String linkedDiscountId;

	private String discountSubType;

	@Valid
	private RivaahGhsDiscountDto rivaahGhsDiscountDetails;

	private Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails;// discount id is key
																									// and respective
																									// cumm. details is
																									// the value

}
