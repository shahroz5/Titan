/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

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
public class AccountDetailsDaoExt extends AccountDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	private String id;

}
