/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import java.math.BigDecimal;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemUpdateDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String description;

	private BigDecimal stdWeight;

	private BigDecimal stdValue;

	@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX)
	private String complexityCode;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX)
	private String productGroupCode;

	@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX)
	private String productCategoryCode;

	@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX)
	private String brandCode;

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX)
	private String itemTypeCode;

	private Integer leadTime;

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX)
	private String orgCode;

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String parentItemCode;

	private Object itemDetails;

	private Object configDetails;

	private Boolean isActive;

	private BigDecimal priceFactor;

	private Boolean isSaleable;

	private Boolean isReturnable;
}
