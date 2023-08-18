/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashbackOfferUpdateDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private String id;

	private BigDecimal discountAmt;

	private BigDecimal discountPercent;

	private BigDecimal maxDiscountAmt;

}
