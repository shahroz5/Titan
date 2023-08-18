/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;

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
public class CashMemoDetailsBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "row_id")
	private Integer rowId;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Column(name = "total_weight", columnDefinition = "decimal")
	private BigDecimal totalWeight;

	@Column(name = "unit_value", columnDefinition = "decimal")
	private BigDecimal unitValue;

	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;

	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "inventory_weight_details", columnDefinition = "NVARCHAR")
	private String inventoryWeightDetails;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "price_details", columnDefinition = "NVARCHAR")
	private String priceDetails;

	@Column(name = "discount_details", columnDefinition = "NVARCHAR")
	private String discountDetails;

	@Column(name = "inventory_weight", columnDefinition = "decimal")
	private BigDecimal inventoryWeight;

	@Column(name = "total_discount", columnDefinition = "decimal")
	private BigDecimal totalDiscount;

	@Column(name = "final_value", columnDefinition = "decimal")
	private BigDecimal finalValue;

	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;

	@Column(name = "measured_weight_details", columnDefinition = "NVARCHAR")
	private String measuredWeightDetails;

	@Column(name = "employee_code")
	private String employeeCode;

	@Column(name = "product_group_code")
	private String productGroupCode;

	@Column(name = "product_category_code")
	private String productCategoryCode;

	@Column(name = "reason")
	private String reason;

	@Column(name = "inventory_std_value", columnDefinition = "decimal")
	private BigDecimal inventoryStdValue;

	@Column(name = "inventory_std_weight", columnDefinition = "decimal")
	private BigDecimal inventoryStdWeight;

	@Column(name = "item_in_stock")
	private Boolean itemInStock;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;

	@Column(name = "hallmark_charges", columnDefinition = "decimal")
	private BigDecimal hallmarkCharges;

	@Column(name = "hallmark_discount", columnDefinition = "decimal")
	private BigDecimal hallmarkDiscount;

	@Column(name = "bin_group_code")
	private String binGroupCode;

	@Column(name = "no_of_items_returned")
	private Short noOfItemsReturned;

	@Column(name="legacy_tep_discount_recovered")
	private Boolean legacyTepDiscountRecovered;
	
	@Column(name="legacy_cm_details",columnDefinition="NVARCHAR")
	private String legacyCmDetails;
	
	@Column(name="pricing_type")
	private String pricingType;
	
	@PrePersist
	private void onPrePersist2() {

		if (this.hallmarkCharges == null) {
			this.hallmarkCharges = BigDecimal.ZERO;
		}

		if (this.hallmarkDiscount == null) {
			this.hallmarkDiscount = BigDecimal.ZERO;
		}
		
		if(this.legacyTepDiscountRecovered==null) {
			this.legacyTepDiscountRecovered=Boolean.FALSE;
		}
	
	}
}
