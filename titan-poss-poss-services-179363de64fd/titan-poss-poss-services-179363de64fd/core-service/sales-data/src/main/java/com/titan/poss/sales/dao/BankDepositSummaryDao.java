/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.sales.base.BankDepositSummaryBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity(name = "BankDepositSummaryDao")
@Table(name = "bank_deposit_summary")
@EqualsAndHashCode(callSuper = false)
public class BankDepositSummaryDao extends BankDepositSummaryBaseDao{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;
	
}
