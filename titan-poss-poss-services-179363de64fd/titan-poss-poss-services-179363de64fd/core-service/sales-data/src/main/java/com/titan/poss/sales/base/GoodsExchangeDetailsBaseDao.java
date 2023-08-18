/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
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
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class GoodsExchangeDetailsBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "metal_type")
	private String metalType;

	@Column(name = "item_type")
	private String itemType;

	@Column(name = "unit_weight", columnDefinition = "decimal")
	private BigDecimal unitWeight;

	@Column(name = "purity", columnDefinition = "decimal")
	private BigDecimal purity;

	@Column(name = "unit_value", columnDefinition = "decimal")
	private BigDecimal unitValue;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;

	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;

	@Column(name = "price_details", columnDefinition = "NVARCHAR")
	private String priceDetails;

	@Column(name = "quantity")
	private Short quantity;

	@Column(name = "row_id")
	private Integer rowId;

	@Column(name = "total_weight", columnDefinition = "decimal")
	private BigDecimal totalWeight;

	@Column(name = "karat", columnDefinition = "decimal")
	private BigDecimal karat;

	@Column(name = "pre_melting_details", columnDefinition = "NVARCHAR")
	private String preMeltingDetails;

	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;

	@Column(name = "final_value", columnDefinition = "decimal")
	private BigDecimal finalValue;

	@Column(name = "discount_details", columnDefinition = "NVARCHAR")
	private String discountDetails;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;
	
//	@Column(name = "item_discount", columnDefinition = "decimal")
//	private BigDecimal itemDiscount;
	@Column(name = "value_on_refund")
	private BigDecimal valueOnRefund;
	
	
	

}
