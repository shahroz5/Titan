/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for RO payment request.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ROPaymentRequestDto {

	private Integer customerId;
	private String paymentCode;
	private BigDecimal amount;
	private String customerName;
	private String customerTitle;
	private String customerMobileNumber;
	private String requestorEmployeeCode;
	private String locationCode;

}
