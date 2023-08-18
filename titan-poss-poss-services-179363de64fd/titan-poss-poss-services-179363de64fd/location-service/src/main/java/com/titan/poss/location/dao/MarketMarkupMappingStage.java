/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/*
@author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "market_markup_mapping_stage")
@EqualsAndHashCode(callSuper = false)
public class MarketMarkupMappingStage extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", name = "correlation_id")
	private String correlationId;

	@Column(name = "metal_type_code")
	private String metalTypeCode;

	private String marketCode;

	@Column(name = "add_amount", columnDefinition = "decimal")
	private BigDecimal addAmount;

	@Column(name = "deduct_amount", columnDefinition = "decimal")
	private BigDecimal deductAmount;

	@Column(name = "approval_id")
	private String approvalId;

	@Column(name = "applicable_date")
	@Temporal(TemporalType.DATE)
	private Date applicableDate;

	@Column(name = "currency_code")
	private String currencyCode;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "price_change_time")
	private Date priceChangeTime;

}
