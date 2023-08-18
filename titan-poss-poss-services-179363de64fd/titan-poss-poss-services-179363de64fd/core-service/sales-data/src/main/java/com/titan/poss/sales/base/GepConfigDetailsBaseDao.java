/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Base DAO for <b>gep_config_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class GepConfigDetailsBaseDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "config_id", columnDefinition = "uniqueidentifier")
	private String configId;

	@Column(name = "config_code")
	private String configCode;

	@Column(name = "config_type")
	private String configType;

	@Column(name = "is_offer_enabled")
	private Boolean isOfferEnabled;

	@Column(name = "config_details", columnDefinition = "NVARCHAR")
	private String configDetails;

	@Column(name = "offer_details", columnDefinition = "NVARCHAR")
	private String offerDetails;

	@Column(name = "exclude_item_code", columnDefinition = "NVARCHAR")
	private String excludeItemCode;

	@Column(name = "exclude_theme_code", columnDefinition = "NVARCHAR")
	private String excludeThemeCode;

	@Column(name = "purity_product_group_details", columnDefinition = "NVARCHAR")
	private String purityProductGroupDetails;

	@Column(name = "rivaah_purity_product_group_details", columnDefinition = "NVARCHAR")
	private String rivaahPurityProductGroupDetails;

}
