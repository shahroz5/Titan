/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The persistent class for the stock_request database table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Builder
@AllArgsConstructor
@Table(name = "stock_request")
@EqualsAndHashCode(callSuper = false)
public class StockRequestDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "acceptance_remarks", columnDefinition = "NVARCHAR")
	private String acceptanceRemarks;

	@Column(name = "approval_remarks", columnDefinition = "NVARCHAR")
	private String approvalRemarks;

	@Column(name = "accepted_by")
	private String acceptedBy;

	@Column(name = "total_accepted_quantity")
	private Short totalAcceptedQuantity;

	@Column(name = "total_approved_quantity")
	private Short totalApprovedQuantity;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "accepted_date")
	private Date acceptedDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "approved_date")
	private Date approvedDate;

	@Column(name = "approved_by")
	private String approvedBy;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "dest_location_code")
	private String destLocationCode;

	@Column(name = "carrier_details", columnDefinition = "NVARCHAR")
	private String carrierDetails;

	@Column(name = "issued_by")
	private String issuedBy;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "issued_date")
	private Date issuedDate;

	@Column(name = "total_issued_quantity")
	private Short totalIssuedQuantity;

	@Column(name = "total_issued_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalIssuedWeight;

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

	@Temporal(TemporalType.DATE)
	@Column(name = "req_doc_date")
	private Date reqDocDate;

	@Column(name = "req_doc_no")
	private Integer reqDocNo;

	@Column(name = "req_fiscal_year")
	private Short reqFiscalYear;

	@Column(name = "req_location_code")
	private String reqLocationCode;

	@Column(name = "request_remarks", columnDefinition = "NVARCHAR")
	private String requestRemarks;

	@Column(name = "status")
	private String status;

	@Column(name = "request_type")
	private String requestType;

	@Column(name = "src_location_code")
	private String srcLocationCode;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "total_requested_quantity")
	private Short totalRequestedQuantity;

	@Column(name = "total_requested_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalRequestedWeight;

	@Column(name = "total_requested_value", columnDefinition = "DECIMAL")
	private BigDecimal totalRequestedValue;

	@Column(name = "org_code")
	private String orgCode;

	@Column(name = "prints")
	private Short prints;

	public StockRequestDao() {
		// Empty Constructor
	}

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	@Column(name = "total_issued_value", columnDefinition = "DECIMAL")
	private BigDecimal totalIssuedValue;

	@Column(name = "total_selected_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalSelectedWeight;

	@Column(name = "total_selected_quantity")
	private Short totalSelectedQuantity;
	
	@Column(name = "com_order_number")
	private String comOrderNumber;
	
	
	@Column(name = "com_order_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date comOrderDate;
	
	@Column(name = "com_user")
	private String comUser;
	
	@Column(name = "com_request_id")
	private String comRequestId;
	
	@Column(name = "com_status")
	private String comStatus;
	
	@Column(name = "com_confirm")
	private Boolean comConfirm;
	
	@PrePersist
	private void onPrePersist2() {
		if (this.getComConfirm() == null) {
			this.setComConfirm(false);
		}
	}
	
}