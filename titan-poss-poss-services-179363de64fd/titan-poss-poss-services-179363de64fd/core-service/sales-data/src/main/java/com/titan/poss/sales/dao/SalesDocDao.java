/*  
 * Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.sales.base.SalesDocBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>sales_doc_master</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "sales_doc_master")
@EqualsAndHashCode(callSuper = false)
public class SalesDocDao extends SalesDocBaseDao{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;
}
