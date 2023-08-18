/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EventCashMemoPaymentDetailsDto {
	
	private String transactionId;
	
	private Integer lineItemNo;
	
	private String paymentType;
	
	private BigDecimal totalAmount;
	
	private String paymentTypeId;
	
	private String paymentTypeSource;

}
