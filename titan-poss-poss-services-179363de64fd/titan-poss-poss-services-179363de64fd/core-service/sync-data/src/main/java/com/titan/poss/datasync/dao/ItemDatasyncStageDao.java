/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Getter
@Setter
@Entity
@Table(name = "item_master_datasync_stage")
@EqualsAndHashCode(callSuper = false)
public class ItemDatasyncStageDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "item_code", length = 20)
	private String itemCode;

	@Column(name = "description")
	private String description;

	@Column(name = "std_weight", columnDefinition = "decimal")
	private BigDecimal stdWeight;

	@Column(name = "std_value", columnDefinition = "decimal")
	private BigDecimal stdValue;

	@Column(name = "complexity_code")
	private String complexity;

	@Column(name = "product_group_code")
	private String productGroup;

	@Column(name = "product_category_code")
	private String productCategory;

	@Column(name = "brand_code")
	private String brandCode;

	@Column(name = "item_type_code")
	private String itemType;

	@Column(name = "lead_time")
	private Integer leadTime;

	@Column(name = "org_code")
	private String orgCode;

	@Column(name = "parent_item_code")
	private String parentItem;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;

	@Column(name = "config_details", columnDefinition = "NVARCHAR")
	private String configDetails;

	@Column(name = "is_editable")
	private Boolean isEditable;

	@Column(name = "tax_class_code")
	private String taxClassCode;

	@Column(name = "pricing_type")
	private String pricingType;

	@Column(name = "pricing_group_type")
	private String pricingGroupType;

	@Column(name = "purity", columnDefinition = "decimal")
	private BigDecimal purity;

	@Column(name = "karat", columnDefinition = "decimal")
	private BigDecimal karat;

	@Column(name = "stone_charges", columnDefinition = "decimal")
	private BigDecimal stoneCharges;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "price_factor", columnDefinition = "decimal")
	private BigDecimal priceFactor;

	@Column(name = "is_foc_item")
	private Boolean isFocItem;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	@Column(name = "is_saleable")
	private Boolean isSaleable;

	@Column(name = "is_returnable")
	private Boolean isReturnable;

	@Column(name = "transfer_type")
	private String transferType;

	@Column(name = "is_active")
	private Boolean isActive;

	@Column(name = "src_sync_id", columnDefinition = "Integer")
	private Integer srcSyncId;

	@Column(name = "dest_sync_id", columnDefinition = "Integer")
	private Integer destSyncId;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "created_date")
	private Date createdDate;

	@Column(name = "last_modified_by")
	private String lastModifiedBy;

	@Column(name = "last_modified_date")
	private Date lastModifiedDate;

	@Column(name = "hsn_sac_code")
	private String hsnSacCode;

	@Column(name = "stone_weight", columnDefinition = "decimal")
	private BigDecimal stoneWeight;

	@Column(name = "diamond_caratage", columnDefinition = "decimal")
	private BigDecimal diamondCaratage;

	@Column(name = "diamond_color")
	private String diamondColor;

	@Column(name = "diamond_clarity")
	private String diamondClarity;

	@Column(name = "stone_combination")
	private String stoneCombination;
	
	@Column(name = "product_type")
	private String productType;
	
	@Column(name = "tot_category")
	private String totCategory;

	@PrePersist
	private void onPrePersist() {
		if (this.getSrcSyncId() == null && this.getDestSyncId() == null) {
			this.setSrcSyncId(0);
			this.setDestSyncId(0);
		}
		if (this.getIsActive() == null) {
			this.setIsActive(true);
		}

	}
}
