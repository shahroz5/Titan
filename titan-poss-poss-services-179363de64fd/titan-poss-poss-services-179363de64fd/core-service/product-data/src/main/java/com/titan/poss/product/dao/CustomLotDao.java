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

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "custom_lot_master")
@EqualsAndHashCode(callSuper = false)
public class CustomLotDao extends MasterAuditableEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "txn_type")
	private String txnType;

	@Column(name = "txn_Code")
	private String txnCode;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "sequence_no")
	private Integer sequenceNo;
}
