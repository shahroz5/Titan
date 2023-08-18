/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.titan.poss.sales.base.CancelBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>cash_memo</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "Cancel")
@Table(name = "refund_transaction")
@EqualsAndHashCode(callSuper = false)
public class CancelDao extends CancelBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@OneToOne
	@JoinColumn(name = "ref_sales_id", referencedColumnName = "id")
	private SalesTxnDao refSalesTxn;

}
