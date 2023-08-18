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
 * @author Mindtree Ltd.
 * @version 2.0
 */

/**
 * The persistent class for the stock_invoice database table.
 * 
 */
@Data
@AllArgsConstructor
@Builder
@Entity
@Table(name = "stock_invoice")
@EqualsAndHashCode(callSuper = false)
public class StockInvoiceDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

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

	@Column(name = "invoice_type")
	private String invoiceType;

	@Column(name = "order_type")
	private String orderType;

	@Column(name = "reason", columnDefinition = "NVARCHAR")
	private String reason;

	@Column(name = "received_remarks", columnDefinition = "NVARCHAR")
	private String receivedRemarks;

	@Column(name = "ref_invoice_id")
	private Integer refInvoiceId;

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

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

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

	@Column(name = "total_discount", columnDefinition = "DECIMAL")
	private BigDecimal totalDiscount;

	@Column(name = "issued_by")
	private String issuedBy;

	@Column(name = "received_by")
	private String receivedBy;

	@Column(name = "org_code")
	private String orgCode;

	@Column(name = "carrier_details", columnDefinition = "NVARCHAR")
	private String carrierDetails;

	public StockInvoiceDao() {
		// Empty Constructor
	}

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	@Column(name = "file_published")
	private Boolean filePublished;
	
	@Column(name = "total_tax", columnDefinition = "DECIMAL")
	private BigDecimal totalTax;
	
}