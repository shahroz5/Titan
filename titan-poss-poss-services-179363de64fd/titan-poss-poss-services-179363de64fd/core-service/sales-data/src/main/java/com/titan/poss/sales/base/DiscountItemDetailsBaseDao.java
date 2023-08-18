/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;

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
public class DiscountItemDetailsBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "item_id", columnDefinition = "uniqueidentifier")
	private String itemId;

	@Column(name = "discount_value", columnDefinition = "Decimal")
	private BigDecimal discountValue;

	@Column(name = "pre_discount_value", columnDefinition = "Decimal")
	private BigDecimal preDiscountValue;

	@Column(name = "min_payment_percent", columnDefinition = "Decimal")
	private BigDecimal minPaymentPercent;

	@Column(name = "discount_value_details", columnDefinition = "NVARCHAR")
	private String discountValueDetails;

	@Column(name = "product_group_code")
	private String productGroupCode;

	@Column(name = "applicable_karatage_type")
	private String applicableKaratageType;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "is_rivaah_discount")
	private Boolean isRivaahDiscount;

}
