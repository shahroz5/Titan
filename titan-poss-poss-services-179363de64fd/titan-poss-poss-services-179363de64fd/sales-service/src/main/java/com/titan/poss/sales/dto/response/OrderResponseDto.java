/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.OrderActivationDetails;
import com.titan.poss.sales.dto.OrderCancelDetails;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for order response.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class OrderResponseDto extends SalesResponseDto {

	private String id;

	private String occasion; // NA in AB, BA has to confirm

	private BigDecimal minOrderPayment;

	private Boolean isFrozenRate;// Need to discuss, will all the metal rate will be freezed or partial is
									// allowed
	private Boolean isBestRate;

	private Boolean rateFrozenDate;

	private OrderCancelDetails cancellationDetails;

	private OrderActivationDetails activationDetails;

	private List<Integer> creditNotes;

	private BigDecimal totalDeliveredWeight;

	private JsonData orderWeightDetails;

	private JsonData deliveredWeightDetails;

	private BigDecimal minDiscountPayment;

	private JsonData minPaymentDetails;

	private JsonData bestRateConfigDetails;
	
	private JsonData nomineeDetails;
	
	private String collectedBy;
	
	private BigDecimal totalOrderValue;
	
	private BigDecimal totalGrossWeight;
	private String custTaxNo;
	private String custTaxNoOld;
	private JsonData cnDetails;

}
