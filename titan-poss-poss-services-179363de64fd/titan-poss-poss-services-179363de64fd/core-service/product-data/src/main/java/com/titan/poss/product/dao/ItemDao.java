/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dao;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

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
@Table(name = "item_master")
@EqualsAndHashCode(callSuper = false)

public class ItemDao extends MasterSyncableEntity implements Serializable {
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "complexity_code", referencedColumnName = "complexity_code")
	private ComplexityDao complexity;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_group_code", referencedColumnName = "product_group_code")
	private ProductGroupDao productGroup;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_category_code", referencedColumnName = "product_category_code")
	private ProductCategoryDao productCategory;

	@Column(name = "brand_code")
	private String brandCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_type_code", referencedColumnName = "item_type_code")
	private ItemTypeDao itemType;

	@Column(name = "lead_time")
	private Integer leadTime;

	@Column(name = "org_code")
	private String orgCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_item_code", referencedColumnName = "item_code")
	private ItemDao parentItem;

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
}
