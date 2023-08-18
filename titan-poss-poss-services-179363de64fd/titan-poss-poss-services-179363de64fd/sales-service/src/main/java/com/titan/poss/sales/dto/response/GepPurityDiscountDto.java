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
 * DTO to store GEP purity discount details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class GepPurityDiscountDto extends BaseDiscountDetailsDto {

	private String configId;
	private String configCode;
	private String configType;
	private BigDecimal discountValue;
	private BigDecimal gepItemPurity;
	private String gepConfigDetailsId;
}
