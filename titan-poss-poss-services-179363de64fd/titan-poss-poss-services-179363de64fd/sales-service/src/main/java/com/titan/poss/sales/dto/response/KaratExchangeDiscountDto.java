/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import com.titan.poss.sales.dto.BaseDiscountDetailsDto;

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
@AllArgsConstructor
@NoArgsConstructor
public class KaratExchangeDiscountDto extends BaseDiscountDetailsDto {

	private BigDecimal oneKTDiscountValue;
	private BigDecimal twoKTDiscountValue;

}
