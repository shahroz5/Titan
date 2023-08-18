/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dao;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "stone_master")
@EqualsAndHashCode(callSuper = false)
public class StoneDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "stone_code")
	private String stoneCode;

	@Column(name = "color")
	private String color;

	@Column(name = "std_weight", columnDefinition = "decimal")
	private BigDecimal stdWeight;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinColumn(name = "stone_type_code", referencedColumnName = "stone_type_code")
	private StoneTypeDao stoneType;

	@Column(name = "quality")
	private String quality;

	@Column(name = "shape")
	private String shape;

	@Column(name = "std_value", columnDefinition = "decimal")
	private BigDecimal stdValue;

	@Column(name = "rate_per_carat", columnDefinition = "decimal")
	private BigDecimal ratePerCarat;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	@Column(name = "config_details", columnDefinition = "nvarchar")
	private String configDetails;

}
