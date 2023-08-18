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
public class StockTransactionDetailsBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "bin_group_code")
	private String binGroupCode;

	@Column(name = "std_value", columnDefinition = "DECIMAL")
	private BigDecimal stdValue;

	@Column(name = "std_weight", columnDefinition = "DECIMAL")
	private BigDecimal stdWeight;

	@Column(name = "quantity")
	private Short quantity;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "karat", columnDefinition = "decimal")
	private BigDecimal karat;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;
	
	}
