/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CashbackOfferResponseDto implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String id;

	private BigDecimal minSwipeAmt;

	private BigDecimal maxSwipeAmt;

	private BigDecimal minInvoiceAmt;

	private BigDecimal maxInvoiceAmt;

	private BigDecimal discountAmt;

	private BigDecimal discountPercent;

	private BigDecimal maxDiscountAmt;

	private Boolean isActive;
}
