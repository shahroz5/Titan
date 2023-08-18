/*  
/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.sales.base.PaymentReversalBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * BaseDAO for <b>payment_details</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "payment_refunds")
@EqualsAndHashCode(callSuper = false)
public class PaymentReversalDao extends PaymentReversalBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cancel_txn_id", referencedColumnName = "id")
	private CancelDao cancel;
	

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "credit_note_id", referencedColumnName = "id")
	private CreditNoteDao creditNote;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id")
	private SalesTxnDao salesTxn;
	

}
