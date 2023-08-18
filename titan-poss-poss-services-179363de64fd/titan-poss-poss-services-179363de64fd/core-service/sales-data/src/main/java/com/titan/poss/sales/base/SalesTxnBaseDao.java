/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
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
public class SalesTxnBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "txn_type")
	private String txnType;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "doc_no")
	private Integer docNo;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "employee_code")
	private String employeeCode;

	@Column(name = "status")
	private String status;

	@Column(name = "customer_id")
	private Integer customerId;

	@Column(name = "metal_rate_details", columnDefinition = "NVARCHAR")
	private String metalRateDetails;

	@Column(name = "first_hold_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date firstHoldTime;

	@Column(name = "last_hold_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastHoldTime;

	@Column(name = "ref_txn_type")
	private String refTxnType;

	@Column(name = "doc_date")
	@Temporal(TemporalType.DATE)
	private Date docDate;

	@Column(name = "sub_txn_type")
	private String subTxnType;

	@Column(name = "manual_bill_details", columnDefinition = "NVARCHAR")
	private String manualBillDetails;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "confirmed_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date confirmedTime;

	@Column(name = "prints")
	private Integer prints;

	@Column(name = "last_invoke_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastInvokeTime;

	@Column(name = "manual_bill_id")
	private String manualBillId;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "customer_doc_details", columnDefinition = "NVARCHAR")
	private String customerDocDetails;

	@Column(name = "request_type")
	private String requestType;

	@Column(name = "previous_status")
	private String previousStatus;

	@Column(name = "requested_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date requestedDate;

	@Column(name = "invoke_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date invokeTime;

	@Column(name = "invoke_count")
	private Integer invokeCount;

	@Column(name = "discount_txn_details", columnDefinition = "NVARCHAR")
	private String discountTxnDetails;

	@Column(name = "ref_sub_txn_type")
	private String refSubTxnType;

	@Column(name = "foc_remarks", columnDefinition = "NVARCHAR")
	private String focRemarks;

	@Column(name = "email_sent_count")
	private Integer emailPrints;

	@Column(name = "manual_foc_date")
	@Temporal(TemporalType.DATE)
	private Date manualFocDate;

	@Column(name = "is_manual_foc")
	private Integer isManualFoc;

	@Column(name = "txn_source")
	private String txnSource;

	@Column(name = "cash_memo_pull_reason")
	private String cashMemoPullReason;
	
	@PrePersist
	private void prePersist() {
		if (this.prints == null)
			this.prints = 0;

		if (this.emailPrints == null)
			this.emailPrints = 0;

		if (this.isManualFoc == null) {
			this.isManualFoc = 0;
		}
	}

	@PreUpdate
	private void onPersist() {
		if (this.emailPrints == null)
			this.emailPrints = 0;
	}

}
