
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
public class CreditNoteBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "credit_note_type")
	private String creditNoteType;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "doc_no")
	private Integer docNo;

	@Temporal(TemporalType.DATE)
	@Column(name = "doc_date")
	private Date docDate;

	@Column(name = "customer_id")
	private Integer customerId;

	@Column(name = "amount", columnDefinition = "decimal")
	private BigDecimal amount;

	@Column(name = "utilised_amount", columnDefinition = "decimal")
	private BigDecimal utilisedAmount;

	@Column(name = "payment_details", columnDefinition = "NVARCHAR")
	private String paymentDetails;

	@Column(name = "eghs_details", columnDefinition = "NVARCHAR")
	private String eghsDetails;

	@Column(name = "frozen_rate_details", columnDefinition = "NVARCHAR")
	private String frozenRateDetails;

	@Column(name = "gep_details", columnDefinition = "NVARCHAR")
	private String gepDetails;

	@Column(name = "activation_details", columnDefinition = "NVARCHAR")
	private String activationDetails;

	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "tep_details", columnDefinition = "NVARCHAR")
	private String tepDetails;

	@Column(name = "grn_details", columnDefinition = "NVARCHAR")
	private String grnDetails;

	@Column(name = "grn_foc_details", columnDefinition = "NVARCHAR")
	private String grnFocDetails;

	@Column(name = "process_id", columnDefinition = "uniqueidentifier")
	private String processId;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "status")
	private String status;

	@Column(name = "workflow_status")
	private String workflowStatus;

	@Column(name = "cancel_remarks", columnDefinition = "NVARCHAR")
	private String cancelRemarks;

	@Column(name = "prints")
	private Integer prints;

	@Column(name = "cash_collected", columnDefinition = "decimal")
	private BigDecimal cashCollected;

	@Column(name = "cn_transfer_id", columnDefinition = "uniqueidentifier")
	private String cnTransferId;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "redeem_date")
	private Date redeemDate;

	@Column(name = "discount_details", columnDefinition = "NVARCHAR")
	private String discountDetails;

	@Column(name = "publish_status")
	private String publishStatus;

	@Column(name = "is_transfer_eghs_allowed")
	private Boolean isTransferEghsAllowed;

	@Column(name = "original_doc_date")
	private Date originalDocDate;
	
	@Column(name = "is_unipay")
	private Boolean isUnipay;
	
	@Column(name = "txn_source")
	private String txnSource;

	@Column(name = "ibt_location")
	private String ibtLocation;

	@Column(name = "ref_doc_no")
	private Integer refDocNo;

	@Column(name = "ref_doc_type")
	private String refDocType;

	@Column(name = "ref_fiscal_year")
	private Short refFiscalYear;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "cancel_date")
	private Date cancelDate;

	@Column(name = "refund_value", columnDefinition = "decimal")
	private BigDecimal refundValue;

	@Column(name = "refund_deduction", columnDefinition = "decimal")
	private BigDecimal refundDeduction;
	

	@Column(name = "debit_note_doc_no")
	private Integer debitNoteDocNo;
	
	@Column(name = "debit_note_fiscal_year")
	private Integer debitNoteFiscalYear;
	
	@PrePersist
	private void onPrePersist2() {
		if (this.getIsTransferEghsAllowed() == null) {
			this.setIsTransferEghsAllowed(true);
			}
		if(this.isUnipay==null) {
			this.setIsUnipay(false);
			}

		if (this.refundValue == null) {
			this.refundValue = BigDecimal.ZERO;
		}
		
		if (this.refundDeduction == null) {
			this.refundDeduction = BigDecimal.ZERO;
		}
	}
}
