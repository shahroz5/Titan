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
@Table(name = "brand_master")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class BrandDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "brand_code")
	private String brandCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_brand_code", referencedColumnName = "brand_code")
	private BrandDao parentBrand;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "org_code", referencedColumnName = "org_code")
	private OrganizationDao organization;

	@Column(name = "pan_card_details", columnDefinition = "NVARCHAR")
	private String panCardDetails;
	
	@Column(name = "config_details", columnDefinition = "NVARCHAR")
	private String configDetails;

	@Column(name = "customer_details", columnDefinition = "NVARCHAR")
	private String customerDetails;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "cm_details", columnDefinition = "NVARCHAR")
	private String cmDetails;
	 
	@Column(name = "tcs_details", columnDefinition = "NVARCHAR")
	private String brandTcsDetails;
}
