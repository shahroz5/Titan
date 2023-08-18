/* Copyright 2019. Titan Company Limited
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
public class BankDepositBaseDao extends SyncableEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "collection_date")
	@Temporal(TemporalType.DATE)
	private Date collectionDate;

	@Column(name = "payment_code")
	private String paymentCode;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "payer_bank_name")
	private String payerBankName;

	@Column(name = "payee_bank_name")
	private String payeeBankName;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "instrument_date", length = 23)
	private Date instrumentDate;

	@Column(name = "deposit_date")
	@Temporal(TemporalType.DATE)
	private Date depositDate;

	@Column(name = "business_date")
	@Temporal(TemporalType.DATE)
	private Date businessDate;

	@Column(name = "instrument_no")
	private String instrumentNo;

	@Column(name = "amount", columnDefinition = "decimal")
	private BigDecimal amount;

	@Column(name = "opening_balance", columnDefinition = "decimal")
	private BigDecimal openingBalance;

	@Column(name = "deposit_amount", columnDefinition = "decimal")
	private BigDecimal depositAmount;

	@Column(name = "pif_no")
	private String pifNo;

	@Column(name = "mid_code")
	private String midCode;

	@Column(name = "approval_details", columnDefinition = "nvarchar")
	private String approvalDetails;

	@Column(name = "is_banking_completed")
	private Boolean isBankingCompleted;

	@Column(name = "deposit_slip_no")
	private String depositSlipNo;

	@Column(name = "document_path")
	private String documentPath;

}
