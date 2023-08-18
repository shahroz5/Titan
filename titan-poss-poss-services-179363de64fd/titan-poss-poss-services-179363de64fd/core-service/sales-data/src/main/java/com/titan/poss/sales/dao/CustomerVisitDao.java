/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.sales.base.CustomerVisitBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>cutomer visit</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "CustomerVisitDao")
@Table(name = "customer_visits")
@EqualsAndHashCode(callSuper = false)
public class CustomerVisitDao extends CustomerVisitBaseDao {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

}
