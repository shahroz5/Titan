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
import com.titan.poss.product.dao.ItemTypeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class PurityBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinColumn(name = "item_type_code", referencedColumnName = "item_type_code")
	private ItemTypeDao itemType;

	@Column(name = "purity", columnDefinition = "decimal")
	private BigDecimal purity;

	@Column(name = "karat", columnDefinition = "decimal")
	private BigDecimal karat;

	@Column(name = "offset", columnDefinition = "decimal")
	private BigDecimal offset;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "is_displayed")
	private Boolean isDisplayed;
}
