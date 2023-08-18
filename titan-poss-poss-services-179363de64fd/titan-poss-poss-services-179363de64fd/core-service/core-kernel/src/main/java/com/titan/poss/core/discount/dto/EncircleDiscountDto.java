/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EncircleDiscountDto {

	@ValueOfEnum(enumClass = DiscountTypeEnum.class, nullCheck = false)
	private String discountType;

	private Boolean isUlpDiscountFlagUpdated;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String ulpDiscountTxnId;

}
