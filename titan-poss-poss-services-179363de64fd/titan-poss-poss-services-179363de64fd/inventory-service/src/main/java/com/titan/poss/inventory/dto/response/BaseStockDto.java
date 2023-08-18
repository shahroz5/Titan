/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;


import lombok.Data;

/**
 * Base DTO to carry Stock Data
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public abstract class BaseStockDto {
	private Integer id;
	private String srcLocationCode;
	private String destLocationCode;
	private String status;
	private String weightUnit;
	private String currencyCode;
	private String srcLocationDescription;
	private String destLocationDescription;

}
