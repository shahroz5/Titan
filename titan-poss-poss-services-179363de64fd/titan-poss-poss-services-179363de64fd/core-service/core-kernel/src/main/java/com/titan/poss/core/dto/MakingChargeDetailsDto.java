/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MakingChargeDetailsDto extends PriceDetails {

	Boolean isDynamic;
	BigDecimal makingChargePercentage; // how much percentage if making_charge||wastage_charge ,making_charge_per_gram
										// shown in UI

	private BigDecimal makingChargePgram;
	private BigDecimal wastagePct;
	private BigDecimal makingChargePct;// actual making percentage
	private BigDecimal makingChargePunit;
	private Boolean isSplit;
}
