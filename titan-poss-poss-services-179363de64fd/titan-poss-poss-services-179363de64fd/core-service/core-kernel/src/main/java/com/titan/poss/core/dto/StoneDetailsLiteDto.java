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
public class StoneDetailsLiteDto extends ItemLotStoneBaseDto {

	private String color;
	private String quality;
	private BigDecimal stoneWeight;
	private BigDecimal price;
	private String description;
}
