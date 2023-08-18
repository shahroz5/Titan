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
import com.titan.poss.sales.dto.PaymentCodeAndGroup;

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
public class PaymentDetailsBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "row_id")
	private Integer rowId;

	@Column(name = "payment_code")
	private String paymentCode;

	@Column(name = "instrument_type")
	private String instrumentType;

	@Column(name = "instrument_no")
	private String instrumentNo;

	@Column(name = "bank_name")
	private String bankName;

	@Column(name = "bank_branch")
	private String bankBranch;

	@Column(name = "reference_1")
	private String reference1;

	@Column(name = "reference_2")
	private String reference2;

	@Column(name = "reference_3")
	private String reference3;

	@Column(name = "amount", columnDefinition = "DECIMAL")
	private BigDecimal amount;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "status")
	private String status;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

	@Column(name = "instrument_date")
	@Temporal(TemporalType.DATE)
	private Date instrumentDate;

	@Column(name = "host_name")
	private String hostName;

	@Column(name = "payment_group")
	private String paymentGroup;

	@Column(name = "sales_txn_type")
	private String salesTxnType;

	@Column(name = "payment_date")
	@Temporal(TemporalType.DATE)
	private Date paymentDate;// business date of payment confirmation

	@Column(name = "reversal_date")
	@Temporal(TemporalType.DATE)
	private Date reversalDate;// business date of payment reversal

	@Column(name = "is_editable")
	private Boolean isEditable;

	@Column(name = "cash_collected", columnDefinition = "DECIMAL")
	private BigDecimal cashCollected;

	@Column(name = "is_tcs_payment")
	private Boolean isTcsPayment;

	@Column(name = "instrument_hash")
	private String instrumentHash;

	@Column(name = "is_void")
	private Boolean isVoid;

	public PaymentCodeAndGroup getPaymentCodeAndGroup() {
		return new PaymentCodeAndGroup(paymentCode, paymentGroup);
	}

	@PrePersist
	private void onPrePersist2() {
		if (this.getIsEditable() == null) {
			this.setIsEditable(true);
		}
		if (this.getIsTcsPayment() == null) {
			this.setIsTcsPayment(false);
		}
		if (this.isVoid == null) {
			this.setIsVoid(false);
		}
	}
}
