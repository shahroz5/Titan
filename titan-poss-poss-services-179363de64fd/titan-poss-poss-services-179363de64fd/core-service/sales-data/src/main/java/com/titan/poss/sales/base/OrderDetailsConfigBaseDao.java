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
 * Base DAO for <b>sales_order_details_config</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class OrderDetailsConfigBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "pricing_type")
	private String pricingType;

	@Column(name = "price_factor", columnDefinition = "DECIMAL")
	private BigDecimal priceFactor;

	@Column(name = "making_charge_markup_factor", columnDefinition = "DECIMAL")
	private BigDecimal makingChargeMarkupFactor;

	@Column(name = "making_charge_margin_details", columnDefinition = "NVARCHAR")
	private String makingChargeMarginDetails;

	@Column(name = "market_ucp_markup_factor", columnDefinition = "DECIMAL")
	private BigDecimal marketUcpMarkupFactor;

}
