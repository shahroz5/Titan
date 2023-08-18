/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

/**
 * The persistent class for the inv_doc_master database table.
 * 
 */
@Data
@Entity
@Table(name = "bin_request")
@EqualsAndHashCode(callSuper = false)
public class BinRequestDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "bin_name")
	private String binName;

	@Column(name = "bin_group_code")
	private String binGroupCode;

	@Column(name = "req_doc_no")
	private Integer reqDocNo;

	@Temporal(TemporalType.DATE)
	@Column(name = "req_doc_date")
	private Date reqDocDate;

	@Column(name = "request_remarks", columnDefinition = "NVARCHAR")
	private String requestedRemarks;

	@Column(name = "status")
	private String status;

	@Column(name = "approved_by")
	private String approvedBy;

	@Column(name = "approval_remarks", columnDefinition = "NVARCHAR")
	private String approvedRemarks;

	@Column(name = "req_fiscal_year")
	private Short reqFiscalYear;

	@Column(name = "req_location_code")
	private String reqLocationCode;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "approval_date")
	private Date approvalDate;

	public BinRequestDao() {
		// empty constructor
	}

}
