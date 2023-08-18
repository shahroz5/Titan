/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO class to carry Filter parameters for list orders
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
public class OrderSearchFilterDto {

	private List<String> statusList;

	private List<String> excludeStatusList;

	private Boolean isFrozenRate;

	private Boolean isBestRate;

	private String locationCode;

}
