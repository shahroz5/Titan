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
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The persistent class for the stock_transfer database table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Builder
@AllArgsConstructor
@Table(name = "stock_transfer")
@EqualsAndHashCode(callSuper = false)
public class StockTransferDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "carrier_details", columnDefinition = "NVARCHAR")
	private String carrierDetails;

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

	@Column(name = "org_code")
	private String orgCode;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "courier_received_date")
	private Date courierReceivedDate;

	@Column(name = "currency_code")
	private String currencyCode;

	@Temporal(TemporalType.DATE)
	@Column(name = "dest_doc_date")
	private Date destDocDate;

	@Column(name = "dest_doc_no")
	private Integer destDocNo;

	@Column(name = "dest_fiscal_year")
	private Short destFiscalYear;

	@Column(name = "dest_location_code")
	private String destLocationCode;

	@Column(name = "issued_remarks", columnDefinition = "NVARCHAR")
	private String issuedRemarks;

	@Column(name = "issued_by")
	private String issuedBy;

	@Column(name = "order_type")
	private String orderType;

	@Column(name = "reason_for_delay", columnDefinition = "NVARCHAR")
	private String reasonForDelay;

	@Column(name = "received_by")
	private String receivedBy;

	@Column(name = "received_remarks", columnDefinition = "NVARCHAR")
	private String receivedRemarks;

	@Temporal(TemporalType.DATE)
	@Column(name = "src_doc_date")
	private Date srcDocDate;

	@Column(name = "src_doc_no")
	private Integer srcDocNo;

	@Column(name = "src_fiscal_year")
	private Short srcFiscalYear;

	@Column(name = "src_location_code")
	private String srcLocationCode;

	@Column(name = "status")
	private String status;

	@Column(name = "transfer_type")
	private String transferType;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "total_issued_quantity")
	private Short totalIssuedQuantity;

	@Column(name = "total_issued_value", columnDefinition = "DECIMAL")
	private BigDecimal totalIssuedValue;

	@Column(name = "total_issued_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalIssuedWeight;

	@Column(name = "total_received_quantity")
	private Short totalReceivedQuantity;

	@Column(name = "total_received_value", columnDefinition = "DECIMAL")
	private BigDecimal totalReceivedValue;

	@Column(name = "total_received_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalReceivedWeight;

	@Column(name = "prints")
	private Short prints;

	@Column(name = "stock_request_id")
	private Integer stockRequestId;

	public StockTransferDao() {
		// Empty Constructor
	}

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;
	
	@Column(name = "file_published")
	private Boolean filePublished;
	
	@Column(name = "cancelled_remarks")
	private String cancelledRemarks;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "cancelled_date")
	private Date cancelledDate;
	
	@Column(name = "is_direct_transfer")
	private Boolean isDirectTransfer;
	

}

