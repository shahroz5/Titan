package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.sales.base.PaymentReversalBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "payment_refunds")
@EqualsAndHashCode(callSuper = false)
public class PaymentReversalDaoExt extends PaymentReversalBaseDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cancel_txn_id", referencedColumnName = "id")
	private CancelDaoExt cancel;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "credit_note_id", referencedColumnName = "id")
	private CreditNoteDaoExt creditNote;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id")
	private SalesTxnDaoExt salesTxn;
}
