/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncTimeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class CashbackOfferDetailsBaseDao extends SyncTimeDao implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Column(name = "min_swipe_amount", columnDefinition = "decimal")
	private BigDecimal minSwipeAmt;

	@Column(name = "max_swipe_amount", columnDefinition = "decimal")
	private BigDecimal maxSwipeAmt;

	@Column(name = "min_invoice_amount", columnDefinition = "decimal")
	private BigDecimal minInvoiceAmt;

	@Column(name = "max_invoice_amount", columnDefinition = "decimal")
	private BigDecimal maxInvoiceAmt;

	@Column(name = "discount_amount", columnDefinition = "decimal")
	private BigDecimal discountAmt;

	@Column(name = "discount_percent", columnDefinition = "decimal")
	private BigDecimal discountPercent;

	@Column(name = "max_discount_amount", columnDefinition = "decimal")
	private BigDecimal maxDiscountAmt;

	@Column(name = "row_id")
	private Integer rowId;
}
