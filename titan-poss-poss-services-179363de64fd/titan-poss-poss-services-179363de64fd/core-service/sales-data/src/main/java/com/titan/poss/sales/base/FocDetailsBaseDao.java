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
public class FocDetailsBaseDao extends SyncableEntity implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "row_id")
	private Short rowId;

	@Column(name = "unit_weight", columnDefinition = "decimal")
	private BigDecimal unitWeight;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Column(name = "total_weight", columnDefinition = "decimal")
	private BigDecimal totalWeight;

	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "employee_code")
	private String employeeCode;

	@Column(name = "status")
	private String status;
	
	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;
	
	@Column(name = "inventory_details", columnDefinition = "NVARCHAR")
	private String inventoryDetails;
}
