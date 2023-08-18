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


import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "tax_master")
@EqualsAndHashCode(callSuper = false)
public class TaxDao extends MasterAuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "tax_code")
	private String taxCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "tax_system")
	private String taxSystem;
}
