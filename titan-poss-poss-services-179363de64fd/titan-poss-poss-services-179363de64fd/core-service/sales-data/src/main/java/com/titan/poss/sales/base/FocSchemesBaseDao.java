/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;

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
public class FocSchemesBaseDao extends SyncableEntity implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	@Column(name = "purchase_items", columnDefinition = "NVARCHAR")
	private String purchaseItems;

	@Column(name = "eligible_foc_items", columnDefinition = "NVARCHAR")
	private String eligibleFocItems;

	@Column(name = "eligible_weight", columnDefinition = "decimal")
	private BigDecimal eligibleWeight;

	@Column(name = "eligible_quantity")
	private Short eligibleQuantity;

	@Column(name = "status")
	private String status;

	@Column(name = "scheme_details", columnDefinition = "NVARCHAR")
	private String schemeDetails;

	@Column(name = "header_config_details", columnDefinition = "NVARCHAR")
	private String headerConfigDetails;

	@Column(name = "row_config_details", columnDefinition = "NVARCHAR")
	private String rowConfigDetails;

	@Column(name = "product_group_details", columnDefinition = "NVARCHAR")
	private String productGroupDetails;

	@Column(name = "foc_item_details", columnDefinition = "NVARCHAR")
	private String focItemDetails;
	
	@Column(name = "manual_foc_item_details", columnDefinition = "NVARCHAR")
	private String manualFocItemDetails;
}
