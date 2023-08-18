/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.sales.base.CreditNoteBaseDao;
import com.titan.poss.sales.dao.AccountDetailsDaoExt;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CreditNoteTransferDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.GepConfigDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CreditNoteEpossDto extends CreditNoteBaseDao {

	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id")
	private SalesTxnDaoExt salesTxn;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "linked_txn_id", referencedColumnName = "id")
	private SalesTxnDaoExt linkedTxn; // what if its a cancel txn--- how to save that object in it...?

	@JoinColumn(name = "parent_cn_id", referencedColumnName = "id")
	private String parentCn;

	@JoinColumn(name = "original_cn_id", referencedColumnName = "id")
	private String originalCn;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cancel_txn_id", referencedColumnName = "id")
	private CancelDaoExt cancelTxn;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cancel_txn_id", referencedColumnName = "id")
	private CustomerTxnDaoExt customerTxn;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "gep_config_details_id", referencedColumnName = "id")
	private GepConfigDetailsDaoExt gepConfigDetailsDao;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "account_id", referencedColumnName = "id")
	private AccountDetailsDaoExt accountDetailsDao;

	private CreditNoteTransferDao creditNoteTransfer;

}
