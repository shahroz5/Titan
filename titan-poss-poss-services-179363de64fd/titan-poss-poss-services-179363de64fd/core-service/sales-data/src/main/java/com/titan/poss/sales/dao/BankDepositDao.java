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

import com.titan.poss.sales.base.BankDepositBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * DAO for <b>bank_deposit</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "BankDeposit")
@Table(name = "bank_deposits")
@EqualsAndHashCode(callSuper = false)
public class BankDepositDao extends BankDepositBaseDao{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "day_master_id", referencedColumnName = "id")
	private BusinessDayDao businessDayDao;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deposit_summary_id", referencedColumnName = "id")
	private BankDepositSummaryDao bankDepositSummaryDao;
}
