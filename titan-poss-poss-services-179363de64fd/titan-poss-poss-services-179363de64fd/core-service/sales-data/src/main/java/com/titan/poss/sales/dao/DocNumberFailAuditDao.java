/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.sales.dao.base.DocNumberFailAuditBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>doc_number_fail_audit</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity(name = "DocNumberFailAuditDao")
@Table(name = "doc_number_fail_audit")
@EqualsAndHashCode(callSuper = false)
public class DocNumberFailAuditDao extends DocNumberFailAuditBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

}
