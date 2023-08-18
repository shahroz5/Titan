/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
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
public class PaymentReversalBaseDao extends SyncableEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "payment_code")
	private String paymentCode;

	@Column(name = "payment_group")
	private String paymentGroup;

	@Column(name = "amount", columnDefinition = "decimal")
	private BigDecimal amount;

	@Column(name = "host_name")
	private String hostName;

	@Column(name = "instrument_type")
	private String instrumentType;

	@Column(name = "instrument_no")
	private String instrumentNo;

	@Column(name = "bank_name")
	private String bankName;

	@Column(name = "reference_1")
	private String reference1;

	@Column(name = "reversal_date")
	@Temporal(TemporalType.DATE)
	private Date reversalDate;// payment reversal date

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

	@Column(name = "instrument_hash")
	private String instrumentHash;
	
	@Column(name = "payment_id")
	private String paymentId;

	@Column(name = "is_residual_refund")
	private Boolean isResidualRefund;
	
	@Column(name = "payment_voucher_no")
	private Integer paymentVoucherNo;

	@PrePersist
	private void onPrePersist2() {
		if (this.getIsResidualRefund() == null) {
			this.setIsResidualRefund(false);

		}

	}

}
