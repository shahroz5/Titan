/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
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

import com.titan.poss.sales.base.BankDepositBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "BankDepositExt")
@Table(name = "bank_deposits")
@EqualsAndHashCode(callSuper = false)
public class BankDepositDaoExt extends BankDepositBaseDao {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "day_master_id", referencedColumnName = "id")
	private BusinessDayDaoExt businessDayDao;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deposit_summary_id", referencedColumnName = "id")
	private BankDepositSummaryDaoExt bankDepositSummaryDao;

}
