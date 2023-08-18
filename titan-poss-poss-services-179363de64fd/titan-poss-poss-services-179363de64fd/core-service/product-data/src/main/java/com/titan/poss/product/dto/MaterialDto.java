/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.dto;

import java.math.BigDecimal;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDto {

	private String materialCode;

	@PatternCheck(regexp = RegExConstants.MATERIAL_TYPE_CODE_REGEX)
	private String materialTypeCode;

	private BigDecimal stdValue;

	private BigDecimal stdWeight;

	private BigDecimal ratePerGram;

	private String color;

	private String quality;

	private String shape;

	private String weightUnit;

	private String currencyCode;

	private Object configDetails;

	private Boolean isActive;

}
