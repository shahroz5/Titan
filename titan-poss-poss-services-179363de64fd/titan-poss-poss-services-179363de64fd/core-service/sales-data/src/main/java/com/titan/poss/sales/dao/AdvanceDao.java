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

import com.titan.poss.sales.base.AdvanceBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "advance_payment")
@EqualsAndHashCode(callSuper = false)
public class AdvanceDao extends AdvanceBaseDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@OneToOne(fetch = FetchType.LAZY)
	// @MapsId
	@JoinColumn(name = "id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private SalesTxnDao salesTxn;

}
