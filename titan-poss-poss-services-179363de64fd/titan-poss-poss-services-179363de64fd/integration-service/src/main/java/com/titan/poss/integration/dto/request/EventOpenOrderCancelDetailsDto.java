/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class EventOpenOrderCancelDetailsDto {

	private String transactionId ;
	
	private String customerId;
	
	private String itemCode;
	
	private String productDescription;
	
	private int quantity;
	
	private BigDecimal unitValue;
	
	private BigDecimal discountAmount;
	
	private BigDecimal totalAmount;

}
