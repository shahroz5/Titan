/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import java.io.Serializable;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO class for <b>customer_location_mapping</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "CustomerLocationMapping")
@Table(name = "customer_location_mapping")
@EqualsAndHashCode(callSuper = false)
public class CustomerLocationMappingDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private CustomerLocationMappingIdDao customerLocationMappingId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_master_id", referencedColumnName = "id")
	private CustomerDao customer;

}
