/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.intg.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.response.HttpResponseUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@Entity
@Table(name = "service_audit")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class ServicePossAuditDao extends AuditableEntity implements  Serializable {
	
	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;

	@Column(name = "sequence_no", unique = true, nullable = false)
	private Integer sequenceNo;
	
	@Column(name = "location_code", nullable = false)
	private String locationCode;
	
	@Column(name = "url", columnDefinition = "NVARCHAR", nullable = false, length = 200)
	private String url;
	
	@OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.ALL)
	@JoinColumn(name = "vendor_code", nullable = false)
	private VendorDao vendor;
	
	@Column(name = "request", columnDefinition = "NVARCHAR", nullable = false, length = 4000)
	private String request;
	
	@Column(name = "response", columnDefinition = "NVARCHAR", nullable = false, length = 4000)
	private String response;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "request_time")
	private Date requestTime;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "response_time")
	private Date responseTime;
	
	@Column(name = "total_time")
	private long totalTime;
	
	@Column(name = "http_status")
	private Integer httpStatus;
	
	@Column(name = "transaction_status", nullable = false)
	private Boolean transactionStatus;
	
	@Column(name = "transaction_type", nullable = false)
	private String transactionType;
	
//	@Column(name = "credit_note_number", nullable = false)
//	private String creditNoteNumber;
//	
//	@Column(name = "sp_voucher_number", nullable = false)
//	private String spVoucherNumber;
//
//	@Column(name = "sp_acount_number", nullable = false)
//	private String spAccountNumber;
//	
//	@Column(name = "invoice_number")
//	private String invoiceNumber;
//	
	@Column(name = "business_date")
	@Temporal(TemporalType.DATE)
	private Date businessDate;
	
}

