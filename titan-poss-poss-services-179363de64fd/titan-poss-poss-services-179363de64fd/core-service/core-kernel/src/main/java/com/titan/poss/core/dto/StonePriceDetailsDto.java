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
public class StonePriceDetailsDto extends PriceDetails {

	private String weightUnit;
	private BigDecimal stoneWeight;
	private Integer numberOfStones;

	private String weightUnitForView;// to show in UI(price pop-up)
	private BigDecimal stoneWeightForView;// to show in UI(price pop-up)

}
