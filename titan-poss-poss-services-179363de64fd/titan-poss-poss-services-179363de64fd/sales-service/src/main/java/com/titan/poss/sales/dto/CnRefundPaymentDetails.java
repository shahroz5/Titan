/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CnRefundPaymentDetails {

	private String paymentCode;

	private String paymentGroup;

	private BigDecimal refundAmount;

	private String instrumentType;

	private String instrumentNo;

	private String bankName;

	private Object otherDetails;

}
