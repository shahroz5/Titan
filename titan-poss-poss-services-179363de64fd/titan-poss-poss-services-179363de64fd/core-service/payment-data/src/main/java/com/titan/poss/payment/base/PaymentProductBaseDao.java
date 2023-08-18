/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.base;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.payment.dao.PaymentCategoryDao;

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
public class PaymentProductBaseDao extends SyncTimeDao implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_category_name", nullable = false)
	private PaymentCategoryDao paymentCategoryDao;

	@Column(name = "product_group_code", columnDefinition = "NVARCHAR", nullable = false, length = 20)
	private String productGroupCode;
}
