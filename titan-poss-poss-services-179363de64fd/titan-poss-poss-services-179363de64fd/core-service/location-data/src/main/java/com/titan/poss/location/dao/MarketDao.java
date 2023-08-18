/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dao;

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
@Table(name = "market_master")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class MarketDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "market_code")
	private String marketCode;

	@Column(name = "description")
	private String description;

}
