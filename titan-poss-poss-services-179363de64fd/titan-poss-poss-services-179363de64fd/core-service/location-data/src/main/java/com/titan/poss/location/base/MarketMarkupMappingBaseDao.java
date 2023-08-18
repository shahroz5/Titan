/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;
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
public class MarketMarkupMappingBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "metal_type_code")
	private String metalTypeCode;

	@Column(name = "markup_factor", columnDefinition = "decimal")
	private BigDecimal markupFactor;

	@Column(name = "add_amount", columnDefinition = "decimal")
	private BigDecimal addAmount;

	@Column(name = "deduct_amount", columnDefinition = "decimal")
	private BigDecimal deductAmount;

	@Column(name = "currency_code")
	private String currencyCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "market_code", referencedColumnName = "market_code")
	private MarketDao market;
}
