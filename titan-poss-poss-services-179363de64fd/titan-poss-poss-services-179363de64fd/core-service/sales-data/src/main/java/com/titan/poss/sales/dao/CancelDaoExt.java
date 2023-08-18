/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

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
public class CancelDaoExt extends CancelBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@OneToOne
	@JoinColumn(name = "ref_sales_id", referencedColumnName = "id")
	private SalesTxnDaoExt refSalesTxn;

	@Override
	public String toString() {
		return "CancelDaoExt [id=" + id + ", getStatus()=" + getStatus() + ", getLocationCode()=" + getLocationCode()
				+ ", getCancellationType()=" + getCancellationType() + ", getTotalValue()=" + getTotalValue()
				+ ", getTotalWeight()=" + getTotalWeight() + ", getTotalQuantity()=" + getTotalQuantity()
				+ ", getCancellationDetails()=" + getCancellationDetails() + "]";
	}

}
