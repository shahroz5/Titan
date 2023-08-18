/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Id;
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
public class CashMemoBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

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
	private String taxDetails; // contains tax details of other charges only

	@Column(name = "final_value", columnDefinition = "decimal")
	private BigDecimal finalValue;

	@Column(name = "paid_value", columnDefinition = "decimal")
	private BigDecimal paidValue;

	@Column(name = "occasion_name")
	private String occasion;

	@Column(name = "other_charges", columnDefinition = "NVARCHAR")
	private String otherCharges;

	@Column(name = "discount_details", columnDefinition = "NVARCHAR")
	private String discountDetails;

	@Column(name = "rounding_variance", columnDefinition = "decimal")
	private BigDecimal roundingVariance;

	@Column(name = "is_migrated")
	private Boolean isMigrated;

	@Column(name = "tcs_amount", columnDefinition = "decimal")
	private BigDecimal tcsAmount;

	@Column(name = "hallmark_charges", columnDefinition = "decimal")
	private BigDecimal hallmarkCharges;

	@Column(name = "hallmark_discount", columnDefinition = "decimal")
	private BigDecimal hallmarkDiscount;

	@Column(name = "is_igst")
	private Boolean isIGST;
	
	@Column(name = "cust_tax_no")
	private String custTaxNo;
	
	@Column(name = "cust_tax_no_old")
	private String custTaxNoOld;

	@Column(name = "is_bill_level_discount_recovery_allowed")
	private Boolean legacyBillLevelDiscount;
	
	@PrePersist
	private void onPrePersist2() {
		if (this.isMigrated == null) {
			this.isMigrated = false;
		}
		if (this.hallmarkCharges == null) {
			this.hallmarkCharges = BigDecimal.ZERO;
		}

		if (this.hallmarkDiscount == null) {
			this.hallmarkDiscount = BigDecimal.ZERO;
		}
		
		if(this.tcsAmount == null) {
			this.tcsAmount =  BigDecimal.ZERO;
		}
		
		if(this.totalQuantity == null) {
			this.totalQuantity = Short.valueOf((short) 0);
		}
		
		if(this.totalWeight == null) {
			this.totalWeight = BigDecimal.ZERO;
		}
		
		if(this.totalValue == null) {
			this.totalValue = BigDecimal.ZERO;
		}
		
		if(this.totalDiscount == null) {
			this.totalDiscount = BigDecimal.ZERO;
		}
		
		if(this.totalTax == null) {
			this.totalTax = BigDecimal.ZERO;
		}
		
		if(this.finalValue == null) {
			this.finalValue = BigDecimal.ZERO;
		}
	
		if(this.roundingVariance == null) {
			this.roundingVariance = BigDecimal.ZERO;
		}

	}
}
