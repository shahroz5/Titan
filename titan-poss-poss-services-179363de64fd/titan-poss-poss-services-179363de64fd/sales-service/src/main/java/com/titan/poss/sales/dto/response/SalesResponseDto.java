/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Respopnse DTO class for Common Fields of Sales transactions
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class SalesResponseDto extends BaseSalesTxnResponseDto {

	private Short totalQuantity;

	private BigDecimal totalWeight;

	private BigDecimal totalValue;

	private BigDecimal totalTax;// value will differ in case of AB

	private BigDecimal finalValue;

	private BigDecimal totalDiscount;

	private BigDecimal paidValue;

	private BigDecimal roundingVariance;

	private MetalRateListDto metalRateList;

	private ManualBillTxnDetailsDto manualBillDetails;

	private String manualBillId;

	private TaxDetailsListDto taxDetails;

	private JsonData discountTxnDetails;

	private Date invokeTime;

	private Integer invokeCount;

	private String customerDocDetails;

	private String requestType;

	private Date requestedDate;

	private String previousStatus;

	private BigDecimal hallmarkCharges;

	private BigDecimal hallmarkDiscount;
	
	//CO attributes
	private String comOrderNumber;
	
	private Boolean isAutoStn;
	
	private Date deliveryDate;
	
	private BigDecimal orderValue;
	
	private BigDecimal grossWeight;
	
	private Date orderDate;
	
	private String requestedBy;
	
	private String requestBtq;
	
}
