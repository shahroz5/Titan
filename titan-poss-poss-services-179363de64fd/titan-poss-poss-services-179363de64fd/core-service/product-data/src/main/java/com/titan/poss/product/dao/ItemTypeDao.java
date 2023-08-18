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
@Table(name = "item_type_master")
@EqualsAndHashCode(callSuper = false)
public class ItemTypeDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "item_type_code")
	private String itemTypeCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "item_group")
	private String itemGroup;

	@Column(name = "org_code")
	private String orgCode;
}
