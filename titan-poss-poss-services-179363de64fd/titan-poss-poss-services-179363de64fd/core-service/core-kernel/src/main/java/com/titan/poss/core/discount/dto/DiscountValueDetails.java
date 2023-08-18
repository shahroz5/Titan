/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DiscountValueDetails {

	private String component;
	private BigDecimal discountValue;
	private BigDecimal discountPercent;
	private Boolean isDiscountPercentage ;

}
