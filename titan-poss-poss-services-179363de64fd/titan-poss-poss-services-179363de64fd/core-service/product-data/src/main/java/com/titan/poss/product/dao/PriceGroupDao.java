/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "price_group_master")
@EqualsAndHashCode(callSuper = false)

public class PriceGroupDao extends MasterSyncableEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "price_group")
	private String priceGroup;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;
}
