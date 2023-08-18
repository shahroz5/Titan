/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao.base;
import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class DocNumberFailAuditBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "doc_no")
	private Integer docNo;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "txn_type")
	private String txnType;

	@Column(name = "sub_txn_type")
	private String subTxnType;

	@Column(name = "status")
	private String status;

	@Column(name = "fail_reason", columnDefinition = "NVARCHAR")
	private String failReason;
}
