/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EventGRNDetailsDto {

	private String itemCode;

	private Short totalQuantity;

	private BigDecimal finalValue;

	private String productGroupCode;

	private BigDecimal totalDiscount;

}
