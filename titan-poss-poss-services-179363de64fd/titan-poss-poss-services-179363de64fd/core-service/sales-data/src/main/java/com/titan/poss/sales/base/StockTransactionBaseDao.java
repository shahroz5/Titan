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
public class StockTransactionBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "transaction_type")
	private String transactionType;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "doc_no")
	private Integer docNo;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Temporal(TemporalType.DATE)
	@Column(name = "doc_date")
	private Date docDate;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "status")
	private String status;

	@Column(name = "total_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalWeight;

	@Column(name = "total_value", columnDefinition = "DECIMAL")
	private BigDecimal totalValue;

	@Column(name = "employee_code")
	private String employeeCode;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

}
