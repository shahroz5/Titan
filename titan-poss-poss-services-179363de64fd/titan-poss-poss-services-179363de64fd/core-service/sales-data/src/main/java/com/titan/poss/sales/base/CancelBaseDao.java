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
public class CancelBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "status")
	private String status;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;

	@Column(name = "cancellation_type")
	private String cancellationType;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "reason_for_cancellation")
	private String reasonForCancellation;

	@Column(name = "employee_code")
	private String employeeCode;

	@Column(name = "cancelled_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date cancelledTime;

	@Column(name = "prints")
	private Short prints;

	@Column(name = "total_weight", columnDefinition = "decimal")
	private BigDecimal totalWeight;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Column(name = "txn_type")
	private String txnType;

	@Column(name = "sub_txn_type")
	private String subTxnType;

	@Column(name = "customer_id")
	private Integer customerId;

	@Column(name = "doc_no")
	private Integer docNo;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "doc_date")
	@Temporal(TemporalType.DATE)
	private Date docDate;

	@Column(name = "cancellation_details", columnDefinition = "NVARCHAR")
	private String cancellationDetails;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "weight_unit")
	private String weightUnit;

	@PrePersist
	private void prePersist() {
		if (this.prints == null)
			this.prints = 0;
	}

}
