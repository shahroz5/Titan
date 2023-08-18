/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;

import javax.annotation.Nullable;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class FocDetailAbRequestDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String schemeId;

	@NotEmpty
	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String> schemeDetailIds;

	@PatternCheck(regexp = RegExConstants.FOC_SCHEME_NAME_REGEX, nullCheck = true)
	private String schemeCategory;

	@PatternCheck(regexp = RegExConstants.FOC_SCHEME_NAME_REGEX, nullCheck = true)
	private String schemeName;

	@Nullable
	private BigDecimal weight;

	@Valid
	private PurchaseItemListDto purchaseItemDetails;

}
