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
import javax.persistence.Table;

import com.titan.poss.sales.base.FocDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "foc_details")
@EqualsAndHashCode(callSuper = false)
public class FocDetailsDao extends FocDetailsBaseDao {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private SalesTxnDao salesTxn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "foc_scheme_id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private FocSchemesDao focScheme;

	@Override
	public String toString() {
		return "FocDetailsDao [id=" + id + ", getItemCode()=" + getItemCode() + ", getLotNumber()=" + getLotNumber()
				+ ", getTotalQuantity()=" + getTotalQuantity() + ", getTotalValue()=" + getTotalValue() + "]";
	}

}
