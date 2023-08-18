/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

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
public class OrderDetailsBaseDao extends SyncableEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column(name = "row_id")
	private Integer rowId;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Column(name = "inventory_weight", columnDefinition = "decimal")
	private BigDecimal inventoryWeight;

	@Column(name = "total_weight", columnDefinition = "decimal")
	private BigDecimal totalWeight;

	@Column(name = "unit_value", columnDefinition = "decimal")
	private BigDecimal unitValue;

	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;

	@Column(name = "total_discount", columnDefinition = "decimal")
	private BigDecimal totalDiscount;

	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;

	@Column(name = "final_value", columnDefinition = "decimal")
	private BigDecimal finalValue;

	@Column(name = "status")
	private String status;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "product_group_code")
	private String productGroupCode;

	@Column(name = "product_category_code")
	private String productCategoryCode;

	@Column(name = "employee_code")
	private String employeeCode;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "price_details", columnDefinition = "NVARCHAR")
	private String priceDetails;

	@Column(name = "discount_details", columnDefinition = "NVARCHAR")
	private String discountDetails;

	@Column(name = "inventory_weight_details", columnDefinition = "NVARCHAR")
	private String inventoryWeightDetails;

	@Column(name = "min_order_payment", columnDefinition = "decimal")
	private BigDecimal minOrderPayment;

	@Column(name = "delivered_quantity")
	private Short deliveredQuantity;

	@Column(name = "delivered_weight", columnDefinition = "decimal")
	private BigDecimal deliveredWeight;

	@Column(name = "item_in_stock")
	private Boolean itemInStock;

	@Column(name = "min_discount_payment", columnDefinition = "decimal")
	private BigDecimal minDiscountPayment;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;

	@Column(name = "min_payment_details", columnDefinition = "NVARCHAR")
	private String minPaymentDetails;

	@Column(name = "hallmark_charges", columnDefinition = "decimal")
	private BigDecimal hallmarkCharges;

	@Column(name = "hallmark_discount", columnDefinition = "decimal")
	private BigDecimal hallmarkDiscount;

	@Column(name = "is_item_to_be_released")
	private Boolean isItemToBeReleased;

	@Column(name = "bin_group_code")
	private String binGroupCode;
	
	@Column(name = "com_order_number")
	private String comOrderNumber;
	
	@Column(name = "is_autostn")
	private Boolean isAutoStn;
	
	@Column(name = "delivery_date")
	private Date deliveryDate;
	
	@Column(name = "order_value")
	private BigDecimal orderValue;
	
	@Column(name = "request_type")
	private String requestType;
	
	@Column(name = "gross_weight")
	private BigDecimal grossWeight;
	
	@Column(name = "order_date")
	private Date orderDate;
	
	@Column(name = "requested_by")
	private String requestedBy;
	
	@Column(name = "request_btq")
	private String requestBtq;
	
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

		if (this.isItemToBeReleased == null) {
			this.isItemToBeReleased = false;
		}
		if(this.orderValue == null) {
			this.orderValue = BigDecimal.ZERO;
		}
		if(this.grossWeight == null) {
			this.grossWeight = BigDecimal.ZERO;
		
		}
		if(this.totalDiscount == null) {
			this.totalDiscount = BigDecimal.ZERO;
		

		}

		if (this.isAutoStn == null) {
			this.isAutoStn = false;
		}

	}
}
