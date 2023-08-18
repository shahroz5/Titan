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
 * DTO for Stock Data
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class StockDto extends BaseStockDto {
	private Integer srcDocNo;
	private Integer srcFiscalYear;
	private Date srcDocDate;
	private Integer destDocNo;
	private Date destDocDate;
	private String orderType;
	private Integer reqDocNo;
	private Date reqDocDate;
	private String cancelledRemarks;
	private Date cancelledDate;
	private String remarks;
	private BigDecimal totalDiscount;
	// while receive totalAvailableQuantity=details totalIssuedQuantity
	// while issue totalAvailableQuantity=details totalReceivedQuantity
	private Short totalAvailableQuantity;
	// while receive totalMeasuredQuantity=details totalReceivedQuantity
	// while issue totalMeasuredQuantity=details totalIssuedQuantity
	private Short totalMeasuredQuantity;

	// while receive totalAvailableValue=details totalIssuedValue
	// while issue totalAvailableValue=details totalReceivedValue
	private BigDecimal totalAvailableValue;
	// while receive totalMeasuredValue=details totalReceivedValue
	// while issue totalMeasuredValue=details totalIssuedValue
	private BigDecimal totalMeasuredValue;

	// while receive totalAvailableWeight=details totalIssuedWeight
	// while issue totalAvailableWeight=details totalReceivedWeight
	private BigDecimal totalAvailableWeight;
	// while receive totalMeasuredWeight=details totalReceivedWeight
	// while issue totalMeasuredWeight=details totalIssuedWeight
	private BigDecimal totalMeasuredWeight;

}
