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

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.product.dao.ItemDao;
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
public class PriceBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_code", referencedColumnName = "item_code")
	private ItemDao item;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "price_group", referencedColumnName = "price_group")
	private PriceGroupDao priceGroup;

	@Column(name = "making_charge", columnDefinition = "decimal")
	private BigDecimal makingCharge;

}
