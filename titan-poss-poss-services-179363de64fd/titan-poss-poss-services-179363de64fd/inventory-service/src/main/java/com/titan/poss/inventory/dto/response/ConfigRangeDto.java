/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class ConfigRangeDto {

	private Integer rangeId;

	private BigDecimal value;

	private BigDecimal fromRange;

	private BigDecimal toRange;
}
