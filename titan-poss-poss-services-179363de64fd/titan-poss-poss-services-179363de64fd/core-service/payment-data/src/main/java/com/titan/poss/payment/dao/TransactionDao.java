/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO class for <b>transaction_master</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "TransactionDao")
@Table(name = "transaction_master")
@EqualsAndHashCode(callSuper = false)
public class TransactionDao extends MasterAuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "transaction_type", nullable = false)
	private String transactionType;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "manual_bill_allowed")
	private Boolean manualBillAllowed;

	@Column(name = "customer_mapping")
	private Boolean customerMapping;

	@Column(name = "payment_mapping")
	private Boolean paymentMapping;

	@PrePersist
	private void onPrePersist2() {
		if (this.getManualBillAllowed() == null) {
			this.setManualBillAllowed(false);
		}

		if (this.getCustomerMapping() == null) {
			this.setCustomerMapping(false);
		}

		if (this.getPaymentMapping() == null) {
			this.setPaymentMapping(false);
		}
	}

}
