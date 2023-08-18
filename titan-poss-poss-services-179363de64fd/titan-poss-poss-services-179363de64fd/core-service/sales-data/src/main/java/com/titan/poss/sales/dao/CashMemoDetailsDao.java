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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.sales.base.CashMemoDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>cash_memo_details</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "cash_memo_details")
@EqualsAndHashCode(callSuper = false)
public class CashMemoDetailsDao extends CashMemoDetailsBaseDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cash_memo_id", referencedColumnName = "id")
	private CashMemoDao cashMemoDao;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_item_id", referencedColumnName = "id")
	private OrderDetailsDao orderItem;
	

	@Override
	public String toString() {
		return "CashMemoDetailsDao [id=" + id + ", getItemCode()=" + getItemCode() + ", getLotNumber()="
				+ getLotNumber() + ", getFinalValue()=" + getFinalValue() + ", getProductGroupCode()="
				+ getProductGroupCode() + ", inventoryId=" + getInventoryId() + "]";

	}

}
