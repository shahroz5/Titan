/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.request;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
/**
* @author Mindtree Ltd.
* @version 2.0
*/
@Data
public class BinUpdateBulkDto {

	private List<@PatternCheck(regexp = RegExConstants.BIN_REGEX)String> srcBincode;
	
	private List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX)String> srcProductCategory;
	
	private List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX)String> srcProductGroup;
	
	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;
	
	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX)
	private String lotNumber;
	
	@PatternCheck(regexp = RegExConstants.BIN_REGEX, nullCheck = true)
	private String destBinCode;
	
	@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX, nullCheck = true)
	private String destBinGroup;
}
