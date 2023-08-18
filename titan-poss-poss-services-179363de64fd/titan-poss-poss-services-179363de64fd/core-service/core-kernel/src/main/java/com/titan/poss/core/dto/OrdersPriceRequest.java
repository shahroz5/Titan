/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class OrdersPriceRequest extends PriceRequest {
	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX)
	private String lotNumber;

	private Boolean checkInventory;

	private Short measuredQuantity;

	private String inventoryId;
	
	private Boolean isComPrice;
	
}
