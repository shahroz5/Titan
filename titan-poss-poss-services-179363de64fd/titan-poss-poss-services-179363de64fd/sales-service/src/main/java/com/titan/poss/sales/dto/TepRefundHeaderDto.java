/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TepRefundHeaderDto {

	private String customerName;

	private Integer customerId;

	private String remarks;

	private BigDecimal totalWeight;

	private BigDecimal totalValue;

	private Short totalQuantity;
	
	private ManualBillTxnDetailsDto manualDetails;

	private List<TepRefundHeaderItemDetailsDto> itemDetails;
	
	private BigDecimal totalRefundAmount;

}
