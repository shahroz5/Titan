/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO class for Stock request item filter params
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
public class StockRequestItemFilterDto {

	private String itemCode;

	private String productGroup;

	private String productCategory;

	private String lotNumber;

	private String binCode;

	private String binGroupCode;

	private String status;

}
