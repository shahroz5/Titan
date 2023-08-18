/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.store.base.BankPriorityBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "payee_bank_priority_mapping")
@EqualsAndHashCode(callSuper = false)
public class BankPriorityDao extends BankPriorityBaseDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

}
