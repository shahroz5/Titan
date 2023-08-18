
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.titan.poss.sales.base.CreditNoteBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "credit_note")
@EqualsAndHashCode(callSuper = false)
public class CreditNoteDao extends CreditNoteBaseDao {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id")
	private SalesTxnDao salesTxn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "linked_txn_id", referencedColumnName = "id")
	private SalesTxnDao linkedTxn;

	@OneToOne
	@JoinColumn(name = "parent_cn_id", referencedColumnName = "id")
	private CreditNoteDao parentCn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "original_cn_id", referencedColumnName = "id")
	private CreditNoteDao originalCn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cancel_txn_id", referencedColumnName = "id")
	private CancelDao cancelTxn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "merged_cn_id", referencedColumnName = "id")
	private CreditNoteDao mergedCN;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "account_id", referencedColumnName = "id")
	private AccountDetailsDao accountDetailsDao;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gep_config_details_id", referencedColumnName = "id")
	private GepConfigDetailsDao gepConfigDetailsDao;

}
