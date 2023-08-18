/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "stock_transaction")
public class StockTransactionDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "transaction_type")
	private String transactionType;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "issued_doc_no")
	private Integer issuedDocNo;

	@Column(name = "issued_fiscal_year")
	private Short issuedFiscalYear;

	@Column(name = "status")
	private String status;

	@Temporal(TemporalType.DATE)
	@Column(name = "issued_doc_date")
	private Date issuedDocDate;

	@Column(name = "total_issued_quantity", nullable = false)
	private Short totalIssuedQuantity;

	@Column(name = "total_issued_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalIssuedWeight;

	@Column(name = "total_issued_value", columnDefinition = "DECIMAL")
	private BigDecimal totalIssuedValue;

	@Column(name = "issued_by")
	private String issuedBy;

	@Column(name = "issued_remarks", columnDefinition = "NVARCHAR")
	private String issuedRemarks;

	@Column(name = "received_doc_no")
	private Integer receivedDocNo;

	@Column(name = "received_fiscal_year")
	private Short receivedFiscalYear;

	@Temporal(TemporalType.DATE)
	@Column(name = "received_doc_date")
	private Date receivedDocDate;

	@Column(name = "total_received_quantity")
	private Short totalReceivedQuantity;

	@Column(name = "total_received_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalReceivedWeight;

	@Column(name = "total_received_value", columnDefinition = "DECIMAL")
	private BigDecimal totalReceivedValue;

	@Column(name = "received_by")
	private String receivedBy;

	@Column(name = "received_remarks", columnDefinition = "NVARCHAR")
	private String receivedRemarks;

	@Column(name = "carrier_details", columnDefinition = "NVARCHAR")
	private String carrierDetails;

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

	@Column(name = "stock_request_id")
	private Integer stockRequestId;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "prints")
	private Short prints;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "prev_transaction_id", referencedColumnName = "id")
	private StockTransactionDao prevTransaction;

	@Column(name = "org_code")
	private String orgCode;

}
