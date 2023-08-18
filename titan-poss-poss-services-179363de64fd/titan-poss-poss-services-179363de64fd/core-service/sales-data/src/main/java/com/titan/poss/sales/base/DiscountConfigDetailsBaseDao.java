/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;

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
public class DiscountConfigDetailsBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "discount_code")
	private String discountCode;

	@Column(name = "discount_type")
	private String discountType;

	@Column(name = "discount_atttributes", columnDefinition = "NVARCHAR")
	private String discountAttributes;

	@Column(name = "basic_criteria_details", columnDefinition = "NVARCHAR")
	private String basicCriteriaDetails;

	@Column(name = "clubbable_config_details", columnDefinition = "NVARCHAR")
	private String clubbableConfigDetails;

	@Column(name = "grn_config_details", columnDefinition = "NVARCHAR")
	private String grnConfigDetails;

	@Column(name = "tep_config_details", columnDefinition = "NVARCHAR")
	private String tepConfigDetails;

	@Column(name = "order_config_details", columnDefinition = "NVARCHAR")
	private String orderConfigDetails;

	@Column(name = "location_offer_details", columnDefinition = "NVARCHAR")
	private String locationOfferDetails;

	@Column(name = "linked_discount_details", columnDefinition = "NVARCHAR")
	private String linkedDiscountDetails;

	@Column(name = "slab_config_details", columnDefinition = "NVARCHAR")
	private String slabConfigDetails;

	@Column(name = "high_value_config_details", columnDefinition = "NVARCHAR")
	private String highValueConfigDetails;

	@Column(name = "applied_discount_component", columnDefinition = "NVARCHAR")
	private String appliedDiscountComponent;

	@Column(name = "regular_discount_component", columnDefinition = "NVARCHAR")
	private String regularDiscountComponent;

	@Column(name = "slab_discount_components", columnDefinition = "NVARCHAR")
	private String slabDiscountComponents;

	@Column(name = "applied_discount_master", columnDefinition = "NVARCHAR")
	private String appliedDiscountMaster;

	@Column(name = "applied_discount_component_type")
	private String appliedDiscountComponentType;

	@Column(name = "product_group_details", columnDefinition = "NVARCHAR")
	private String productGroupDetails;

	@Column(name = "product_category_details", columnDefinition = "NVARCHAR")
	private String productCategoryDetails;

	@Column(name = "exclude_config_details", columnDefinition = "NVARCHAR")
	private String excludeConfigDetails;

	@Column(name = "ghs_exclude_product_group_details", columnDefinition = "NVARCHAR")
	private String ghsExcludeProductGroupDetails;

}
