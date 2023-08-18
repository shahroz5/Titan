/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>customer_town_master</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "customer_town_master")
@EqualsAndHashCode(callSuper = false)
public class CustomerTownDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private CustomerTownId customerTownId;

	@Column(name = "state_code", columnDefinition = "uniqueidentifier")
	private String stateCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

}
