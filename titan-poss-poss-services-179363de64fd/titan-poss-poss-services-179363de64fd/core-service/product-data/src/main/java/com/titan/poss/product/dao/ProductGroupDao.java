/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "product_group_master")
@EqualsAndHashCode(callSuper = false)
public class ProductGroupDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "product_group_code")
	private String productGroupCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "org_code")
	private String orgCode;

	@Column(name = "config_details", columnDefinition = "NVARCHAR")
	private String configDetails;

	@Column(name = "plain_studded")
	private String plainStudded;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinColumn(name = "item_type_code", referencedColumnName = "item_type_code")
	private ItemTypeDao itemType;

	@Column(name = "pricing_type")
	private String pricingType;

	@Column(name = "pricing_details", columnDefinition = "NVARCHAR")
	private String pricingDetails;

	@Column(name = "is_mia")
	private Boolean isMia;

	@Column(name = "plain_studded_tep")
	private String plainStuddedTep;

	@Column(name = "plain_studded_grn")
	private String plainStuddedGrn;

	@Column(name = "plain_studded_grf")
	private String plainStuddedGrf;

}
