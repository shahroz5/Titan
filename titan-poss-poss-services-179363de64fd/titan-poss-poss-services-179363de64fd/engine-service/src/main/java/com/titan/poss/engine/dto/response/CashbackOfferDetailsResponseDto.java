/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto.response;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

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
public class CashbackOfferDetailsResponseDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private BigDecimal minSwipeAmt;

	private BigDecimal minInvoiceAmt;

	private BigDecimal minDiscountAmt;

	private BigDecimal maxDiscountAmtAllowed;

	private Date offerStartDate;

	private Date offerEndDate;

	private BigDecimal maxSwipeAmt;

}
