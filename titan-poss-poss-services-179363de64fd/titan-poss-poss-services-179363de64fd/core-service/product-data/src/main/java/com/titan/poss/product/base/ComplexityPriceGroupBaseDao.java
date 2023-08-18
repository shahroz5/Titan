/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.PriceGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@MappedSuperclass
public class ComplexityPriceGroupBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinColumn(name = "complexity_code", referencedColumnName = "complexity_code")
	private ComplexityDao complexity;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinColumn(name = "price_group", referencedColumnName = "price_group")
	private PriceGroupDao priceGroup;

	@Column(name = "making_charge_punit", columnDefinition = "DECIMAL")
	private BigDecimal makingChargePunit;

	@Column(name = "making_charge_pgram", columnDefinition = "DECIMAL")
	private BigDecimal makingChargePgram;

	@Column(name = "wastage_pct", columnDefinition = "DECIMAL")
	private BigDecimal wastagePct;

	@Column(name = "making_charge_pct", columnDefinition = "DECIMAL")
	private BigDecimal makingChargePct;

	@Column(name = "currency_code")
	private String currencyCode;
	
	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;
}
