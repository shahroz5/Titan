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
public class GrnDetailsBaseDao extends SyncableEntity implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "cash_memo_details_id", columnDefinition = "uniqueidentifier")
	private String cashMemoDetailsId;

	@Column(name = "foc_details_id", columnDefinition = "uniqueidentifier")
	private String focDetailsId;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Column(name = "final_value", columnDefinition = "decimal")
	private BigDecimal finalValue;

	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;
}
