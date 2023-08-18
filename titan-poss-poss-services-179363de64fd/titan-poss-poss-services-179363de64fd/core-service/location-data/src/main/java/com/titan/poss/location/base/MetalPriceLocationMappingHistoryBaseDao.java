/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.MarketDao;

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
public class MetalPriceLocationMappingHistoryBaseDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "metal_type_code")
	private String metalTypeCode; // will be populated from Code material_master

	@Column(name = "metal_rate", columnDefinition = "decimal")
	private BigDecimal metalRate; // will be computed price

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "location_code", referencedColumnName = "location_code")
	private LocationDao location; // FK of location master

	@Column(name = "applicable_date")
	@Temporal(TemporalType.DATE)
	private Date applicableDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "market_code", referencedColumnName = "market_code")
	private MarketDao market; // FK of market master

	@Column(name = "currency_code")
	private String currencyCode;

}
