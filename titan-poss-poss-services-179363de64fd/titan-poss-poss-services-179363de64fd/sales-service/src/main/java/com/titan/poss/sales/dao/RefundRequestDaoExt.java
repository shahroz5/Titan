/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "refund_request")
@EqualsAndHashCode(callSuper = false)
public class RefundRequestDaoExt extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "refund_type")
	private String refundType;

	@Column(name = "approved_data", columnDefinition = "NVARCHAR")
	private String approvedData;

	@Column(name = "request_data", columnDefinition = "NVARCHAR")
	private String requestData;

	@Column(name = "header_data", columnDefinition = "NVARCHAR")
	private String headerData;

	@Column(name = "status")
	private String status;

	@Column(name = "remarks")
	private String remarks;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "txn_type")
	private String txnType;

	@Column(name = "requestor_name")
	private String requestorName;

	@Column(name = "approver_name")
	private String approverName;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "approved_date_time")
	private Date approvedDateTime;

	@Column(name = "ref_txn_id", columnDefinition = "uniqueidentifier")
	private String refTxnId;

	@Column(name = "doc_no")
	private Integer docNo;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "doc_date")
	@Temporal(TemporalType.DATE)
	private Date docDate;

	@Column(name = "sub_txn_type")
	private String subTxnType;
	
	@Column(name = "employee_code")
	private String employeeCode;
	

}
