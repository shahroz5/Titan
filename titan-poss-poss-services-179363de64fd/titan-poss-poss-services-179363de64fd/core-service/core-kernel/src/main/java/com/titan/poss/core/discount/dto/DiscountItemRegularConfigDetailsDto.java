/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountItemRegularConfigDetailsDto {

	private Boolean regularF2IsPercent;

	private Boolean regularUcpIsPercent;

	private Boolean regularVIsPercent;

	private Boolean regularF1IsPercent;

	private BigDecimal regularF2Value;

	private BigDecimal regularUcpValue;

	private BigDecimal regularVValue;

	private BigDecimal regularF1Value;

	private BigDecimal regularWeightValue;

	private Boolean regularIsGrossWeight;
}
