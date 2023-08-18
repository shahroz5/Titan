/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.request.json;

import java.math.BigDecimal;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.location.dto.constants.Form60AmountTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class Form60Details {
	private BigDecimal indianCustomerPercent;

	private BigDecimal nonIndianCustomerPercent;

	@ValueOfEnum(enumClass = Form60AmountTypeEnum.class)
	private String amountType;
}
