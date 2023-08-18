/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.AuditableEntity;

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
public class MetalPriceConfigBaseDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "metal_type_code")
	private String metalTypeCode; // will be populated from Code material_master

	@Column(name = "base_price", columnDefinition = "decimal")
	private BigDecimal basePrice;

	@Column(name = "price_type")
	private String priceType; // will be populated from code location_lov_master

	@Column(name = "applicable_date")
	@Temporal(TemporalType.DATE)
	private Date applicableDate;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "currency_code")
	private String currencyCode;
}
