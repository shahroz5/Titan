package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.sales.base.AccountDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO class for <b>account_details</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "account_details")
@EqualsAndHashCode(callSuper = false)
public class AccountDetailsDao extends AccountDetailsBaseDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

}
