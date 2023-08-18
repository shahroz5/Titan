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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.sales.base.SalesTxnBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>sales_transaction</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "SalesTxnDao")
@Table(name = "sales_transaction")
@EqualsAndHashCode(callSuper = false)
public class SalesTxnDao extends SalesTxnBaseDao {

	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ref_txn_id", referencedColumnName = "id")
	private SalesTxnDao refTxnId;

}
