
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

import com.titan.poss.sales.base.CreditNoteBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "credit_note")
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
public class CreditNoteDaoExt extends CreditNoteBaseDao {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	@EqualsAndHashCode.Include
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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "parent_cn_id", referencedColumnName = "id")
	private CreditNoteDaoExt parentCn;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "original_cn_id", referencedColumnName = "id")
	private CreditNoteDaoExt originalCn;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cancel_txn_id", referencedColumnName = "id")
	private CancelDaoExt cancelTxn;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "merged_cn_id", referencedColumnName = "id")
	private CreditNoteDaoExt mergedCN;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "account_id", referencedColumnName = "id")
	private AccountDetailsDaoExt accountDetailsDao;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gep_config_details_id", referencedColumnName = "id")
	private GepConfigDetailsDaoExt gepConfigDetailsDao;
//	
//	@Column(name = "prints")
//	private Integer prints;

}
