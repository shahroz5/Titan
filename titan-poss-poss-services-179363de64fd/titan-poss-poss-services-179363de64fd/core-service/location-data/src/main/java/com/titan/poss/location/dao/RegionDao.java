/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
@Table(name = "region_master")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class RegionDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "region_code")
	private String regionCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_region_code", referencedColumnName = "region_code")
	private RegionDao parentRegion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "org_code", referencedColumnName = "org_code")
	private OrganizationDao organization;

	@Column(name = "config_details", columnDefinition = "NVARCHAR")
	private String configDetails;
}
