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

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "product_price_mapping")
@EqualsAndHashCode(callSuper = false)
public class ProductPriceMappingDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "from_band")
	private Integer fromBand;

	@Column(name = "to_band")
	private Integer toBand;

	@Column(name = "from_price", columnDefinition = "DECIMAL")
	private BigDecimal fromPrice;

	@Column(name = "to_price", columnDefinition = "DECIMAL")
	private BigDecimal toPrice;

	@Column(name = "margin", columnDefinition = "DECIMAL")
	private BigDecimal margin;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_group_code", referencedColumnName = "product_group_code")
	private ProductGroupDao productGroup;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
