/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for customer payment details;
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPaymentDetailsDto {

	@NotNull
	private String paymentCode;
	private String paymentType;
	@NotNull
	private String paymentId;
	private String instrumentNo;
	@NotNull
	private BigDecimal paidAmount;
	@NotNull
	private BigDecimal cashAmount;
	@NotNull
	private Date paymentDate;
	@NotNull
	private Date instrumentDate;

}
