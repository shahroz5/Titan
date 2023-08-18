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
 * Base DAO class for <b>market_ucp_price_mapping</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class MarketUcpPriceMappingBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "market_code", referencedColumnName = "market_code")
	private MarketDao marketDao;

	@Column(name = "product_group_code")
	private String productGroupCode;

	@Column(name = "markup_factor", columnDefinition = "DECIMAL")
	private BigDecimal markupFactor;

}
