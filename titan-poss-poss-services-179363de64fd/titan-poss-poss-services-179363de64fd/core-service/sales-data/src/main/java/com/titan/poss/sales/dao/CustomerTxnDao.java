/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.sales.base.CustomerTxnBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>customer_transaction</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "CustomerTxn")
@Table(name = "customer_transaction")
@EqualsAndHashCode(callSuper = false)
public class CustomerTxnDao extends CustomerTxnBaseDao {

	private static final long serialVersionUID = 1L;

	@JsonIgnore
	@OneToOne(fetch = FetchType.LAZY)
	// @MapsId
	@JoinColumn(name = "id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private SalesTxnDao salesTxnDao;

}
