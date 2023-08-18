/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversionItemDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;// item_code(item_master)

	@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX)
	private String productCategoryCode;// code(product_category_master)

	private String productType;// product_type(product_group_master)

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX)
	private String productGroupCode;// product_group_code(product_group_master)

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String itemDescription;// description(item_master)

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String parentItemCode;// parent_item_code(item_master)

	@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX)
	private String complexityCode;// complexity_code(complexity_master)

	private BigDecimal stdWeight;// std_weight(item_master)
	private BigDecimal stdValue;// std_value(item_master)
	private BigDecimal stoneValue;// stone_value(lot_master)
	private BigDecimal stoneWeight;// stone_weight(lot_master)

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX)
	private String lotNumber;// lot_number(lot_master)

	private Date mfgDate;// mfg_date(lot_master)

	private List<ConversionItemDto> childItems;

	private boolean isAutoApproved;
	
	private boolean sold;
	
	private boolean studded;

	private String pricingGroupType;
}
