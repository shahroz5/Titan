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
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Wither;

/**
* @author Mindtree Ltd.
* @version 2.0
*/

/**
 * The persistent class for the stock_transfer_details database table.
 * 
 */
@Data
@Entity
@AllArgsConstructor
@Builder
@Wither
@EqualsAndHashCode(callSuper = false)
@Table(name = "stock_transfer_details")
public class StockTransferDetailsDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "bin_group_code")
	private String binGroupCode;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;

	@Column(name = "lot_number")
	private String lotNumber;

	@Temporal(TemporalType.DATE)
	@Column(name = "mfg_date")
	private Date mfgDate;

	@Column(name = "order_type")
	private String orderType;

	@Column(name = "product_category")
	private String productCategory;

	@Column(name = "product_group")
	private String productGroup;

	@Column(name = "reference_no")
	private String referenceNo;

	@Column(columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "status")
	private String status;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "weight_unit")
	private String weightUnit;

	@ManyToOne
	@JoinColumn(name = "stock_transfer_id")
	private StockTransferDao stockTransfer;

	@Column(name = "received_value", columnDefinition = "DECIMAL")
	private BigDecimal receivedValue;

	@Column(name = "issued_quantity")
	private Short issuedQuantity;

	@Column(name = "issued_weight", columnDefinition = "DECIMAL")
	private BigDecimal issuedWeight;

	@Column(name = "issued_value", columnDefinition = "DECIMAL")
	private BigDecimal issuedValue;

	@Column(name = "std_value", columnDefinition = "DECIMAL")
	private BigDecimal stdValue;

	@Column(name = "std_weight", columnDefinition = "DECIMAL")
	private BigDecimal stdWeight;

	@Column(name = "received_quantity")
	private Short receivedQuantity;

	@Column(name = "received_weight", columnDefinition = "DECIMAL")
	private BigDecimal receivedWeight;

	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;

	@Column(name = "issued_weight_details", columnDefinition = "NVARCHAR")
	private String issuedWeightDetails;

	@Column(name = "received_weight_details", columnDefinition = "NVARCHAR")
	private String receivedWeightDetails;

	public StockTransferDetailsDao() {
		// Empty Constructor
	}

	@Column(name = "ref_doc_no")
	private Integer refDocNumber;

	@Column(name = "ref_fiscal_year")
	private Short refFiscalYear;

	@Column(name = "ref_doc_type")
	private String refDocType;
	
	@Column(name = "ref_doc_date")
	private Date refDocDate;
	
	@Column(name = "karat", columnDefinition = "decimal")
	private BigDecimal karat;
	
	@Column(name = "final_value", columnDefinition = "decimal")
	private BigDecimal finalValue;
	
	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;
	
	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}