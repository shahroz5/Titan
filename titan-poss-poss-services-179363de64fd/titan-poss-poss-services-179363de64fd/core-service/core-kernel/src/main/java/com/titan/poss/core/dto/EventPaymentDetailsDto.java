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
public class EventPaymentDetailsDto {

	private String paymentCode;

	private String instrumentNo;

	private String bankName;

	private BigDecimal amount;

}
