/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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
public class OrderBaseDao extends SyncableEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Column(name = "total_weight", columnDefinition = "decimal")
	private BigDecimal totalWeight;

	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;

	@Column(name = "total_discount", columnDefinition = "decimal")
	private BigDecimal totalDiscount;

	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "final_value", columnDefinition = "decimal")
	private BigDecimal finalValue;

	@Column(name = "paid_value", columnDefinition = "decimal")
	private BigDecimal paidValue;

	@Column(name = "rounding_variance", columnDefinition = "decimal")
	private BigDecimal roundingVariance;

	@Column(name = "discount_details", columnDefinition = "NVARCHAR")
	private String discountDetails;

	@Column(name = "min_order_payment", columnDefinition = "decimal")
	private BigDecimal minOrderPayment;

	@Column(name = "is_frozen_rate")
	private Boolean isFrozenRate;

	@Column(name = "is_best_rate")
	private Boolean isBestRate;

	@Column(name = "rate_frozen_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date rateFrozenDate;

	@Column(name = "cancellation_details", columnDefinition = "NVARCHAR")
	private String cancellationDetails;

	@Column(name = "activation_details", columnDefinition = "NVARCHAR")
	private String activationDetails;

	@Column(name = "total_delivered_quantity")
	private Short totalDeliveredQuantity;

	@Column(name = "total_delivered_weight", columnDefinition = "decimal")
	private BigDecimal totalDeliveredWeight;

	@Column(name = "order_weight_details", columnDefinition = "NVARCHAR")
	private String orderWeightDetails;

	@Column(name = "delivered_weight_details", columnDefinition = "NVARCHAR")
	private String deliveredWeightDetails;

	@Column(name = "suspended_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date suspendedDate;

	@Column(name = "min_discount_payment", columnDefinition = "decimal")
	private BigDecimal minDiscountPayment;

	@Column(name = "min_payment_details", columnDefinition = "NVARCHAR")
	private String minPaymentDetails;

	@Column(name = "best_rate_config_details", columnDefinition = "NVARCHAR")
	private String bestRateConfigDetails;

	@Column(name = "hallmark_charges", columnDefinition = "decimal")
	private BigDecimal hallmarkCharges;

	@Column(name = "hallmark_discount", columnDefinition = "decimal")
	private BigDecimal hallmarkDiscount;
	
	@Column(name = "nominee_details", columnDefinition = "NVARCHAR")
	private String nomineeDetails;
	
	@Column(name = "collected_by", columnDefinition = "VARCHAR")
	private String collectedBy;
	
	@Column(name = "total_order_value", columnDefinition = "decimal")
	private BigDecimal totalOrderValue;
	
	@Column(name = "total_gross_weight", columnDefinition = "decimal")
	private BigDecimal totalGrossWeight;
	
	@Column(name = "cust_tax_no")
	private String custTaxNo;
	
	@Column(name = "cust_tax_no_old")
	private String custTaxNoOld;

	@Column(name = "cn_details", columnDefinition = "NVARCHAR")
	private String cnDetails;
	
	@PrePersist
	private void onPrePersist2() {
		
		if (this.hallmarkCharges == null) {
			this.hallmarkCharges = BigDecimal.ZERO;
		}

		if (this.hallmarkDiscount == null) {
			this.hallmarkDiscount = BigDecimal.ZERO;
		}
		
		if(this.totalOrderValue == null) {
			this.totalOrderValue = BigDecimal.ZERO;
		}
		if(this.totalGrossWeight == null) {
			this.totalGrossWeight = BigDecimal.ZERO;
		}
	}
}
