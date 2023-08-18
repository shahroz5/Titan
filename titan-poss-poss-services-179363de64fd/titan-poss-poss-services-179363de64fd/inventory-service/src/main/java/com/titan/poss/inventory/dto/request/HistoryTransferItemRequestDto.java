/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class HistoryTransferItemRequestDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;

	private List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroups;

	private List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategories;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX)
	private String lotNumber;

	private List<@PatternCheck(regexp = RegExConstants.BIN_REGEX)String> binCodes;

	@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX)
	private String binGroupCode;

	private List<String> statuses;

}
