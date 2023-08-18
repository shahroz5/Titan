/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import javax.annotation.Nullable;
import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class to hold Applicable FOC scheme details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocSchemeDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String schemeId;

	@Nullable
	private List<String> schemeDetailIds;
	
	@PatternCheck(regexp = RegExConstants.FOC_SCHEME_NAME_REGEX, nullCheck = false)
	private String schemeCategory;

	@PatternCheck(regexp = RegExConstants.FOC_SCHEME_NAME_REGEX, nullCheck = true)
	private String schemeName;
	
	@Valid
	private PurchaseItemListDto purchaseItemDetails;

	@Valid
	@Nullable
	private EligibleFocItemListDto eligibleFocItemDetails;

}
