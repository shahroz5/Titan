/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>payment_requests</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "SalesPaymentRequests")
@Table(name = "payment_requests")
@EqualsAndHashCode(callSuper = false)
public class PaymentRequestsDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
	@JoinColumn(name = "location_code", referencedColumnName = "location_code")
	private CustomerLocationMappingDao customerLocationMap;

	@Column(name = "reference_id")
	private String referenceId;

	@Column(name = "payment_code")
	private String paymentCode;

	@Column(name = "amount", columnDefinition = "decimal")
	private BigDecimal amount;

	@Column(name = "utilized_amount", columnDefinition = "decimal")
	private BigDecimal utilizedAmount;

	@Column(name = "status")
	private String status;

	@Column(name = "requested_by")
	private String requestedBy;

	@Temporal(TemporalType.DATE)
	@Column(name = "requested_date", length = 23)
	private Date requestedDate;

	@Column(name = "requested_reason", columnDefinition = "NVARCHAR")
	private String requestedReason;

	@Column(name = "approved_by")
	private String approvedBy;

	@Temporal(TemporalType.DATE)
	@Column(name = "approved_date", length = 23)
	private Date approvedDate;

	@Column(name = "approved_reason", columnDefinition = "NVARCHAR")
	private String approvedReason;

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "doc_date")
	@Temporal(TemporalType.DATE)
	private Date docDate;
	
	@Column(name = "is_cn_generated")
	private Boolean isCnGenerated;
	
	@PrePersist
	private void onPrePersist2() {

		if (this.isCnGenerated == null) {
			this.isCnGenerated = Boolean.FALSE;
		}
	
	}

	

	

}
