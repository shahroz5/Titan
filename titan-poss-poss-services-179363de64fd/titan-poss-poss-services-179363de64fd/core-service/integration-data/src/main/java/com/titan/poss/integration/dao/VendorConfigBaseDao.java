/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dao;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class VendorConfigBaseDao extends MasterSyncableEntity implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "location_code", nullable = false, length = 40)
	private String locationCode;

	@Column(name = "org_code", nullable = false, length = 5)
	private String orgCode;

	@Column(name = "config_details", columnDefinition = "NVARCHAR", nullable = true, length = 500)
	private String configDetails;

	@Column(name = "connection_details", columnDefinition = "NVARCHAR", nullable = true, length = 500)
	private String connectionDetails;

	@Column(name = "is_active", nullable = false)
	private Boolean isActive;
}
