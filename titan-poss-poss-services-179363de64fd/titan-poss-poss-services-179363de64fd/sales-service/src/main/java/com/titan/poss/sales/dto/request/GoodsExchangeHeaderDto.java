/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GoodsExchangeHeaderDto {

	private String locationCode;

	private String customerName;

	private Integer cmDocNo;

	private Short fiscalYear;

	private String itemCode;

	private BigDecimal stdWeight;

	private BigDecimal measuredWeight;

	private BigDecimal finalValue;

	private Short totalQuantity;

	private String salesTxnId;

	private String cashMemoDetailsId;
	
	private ManualBillTxnDetailsDto manualDetails;
	
	private String customerMobileNo;
	
	private JsonData tepExceptionDetails;
	
	private String paymentType;
	
	private BigDecimal totalRefundValue;
	
	private String employeeCode;

}
