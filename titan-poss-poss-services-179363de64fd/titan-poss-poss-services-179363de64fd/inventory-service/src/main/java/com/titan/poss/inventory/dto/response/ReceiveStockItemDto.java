/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO to carry Stock Transfer Item Data for Receive
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ReceiveStockItemDto extends StockItemDto {

	private String remarks;
	private String refDocType;
	private Date refDocDate;
	private Short refFiscalYear;
	private Integer refDocNumber;
	private BigDecimal karat;
	private BigDecimal finalValue;
	private BigDecimal totalTax;
	private BigDecimal karatage;
	
	
}
