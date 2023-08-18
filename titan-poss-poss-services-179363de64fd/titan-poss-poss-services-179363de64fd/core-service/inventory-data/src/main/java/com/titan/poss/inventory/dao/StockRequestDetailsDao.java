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

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

/**
 * The persistent class for the stock_request_details database table.
 * 
 */
@Data
@Entity
@Table(name = "stock_request_details")
@EqualsAndHashCode(callSuper = false)
public class StockRequestDetailsDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "approved_quantity")
	private Short approvedQuantity;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "bin_group_code")
	private String binGroupCode;

	@Column(name = "issued_quantity")
	private Short issuedQuantity;

	@Column(name = "issued_weight", columnDefinition = "DECIMAL")
	private BigDecimal issuedWeight;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;

	@Column(name = "lot_number")
	private String lotNumber;

	@Temporal(TemporalType.DATE)
	@Column(name = "mfg_date")
	private Date mfgDate;

	@Column(name = "reason", columnDefinition = "NVARCHAR")
	private String reason;

	@Column(name = "requested_quantity")
	private Short requestedQuantity;

	private String status;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "requested_value", columnDefinition = "DECIMAL")
	private BigDecimal requestedValue;

	@Column(name = "requested_weight", columnDefinition = "DECIMAL")
	private BigDecimal requestedWeight;

	@Column(name = "selected_weight", columnDefinition = "DECIMAL")
	private BigDecimal selectedWeight;

	@Column(name = "accepted_quantity")
	private Short acceptedQuantity;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "product_category")
	private String productCategory;

	@Column(name = "product_group")
	private String productGroup;

	@ManyToOne
	@JoinColumn(name = "stock_request_id")
	private StockRequestDao stockRequest;

	@Column(name = "selected_quantity")
	private Short selectedQuantity;

	@Column(name = "std_value", columnDefinition = "DECIMAL")
	private BigDecimal stdValue;

	@Column(name = "std_weight", columnDefinition = "DECIMAL")
	private BigDecimal stdWeight;

	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;

	@Column(name = "issued_by")
	private String issuedBy;

	@Column(name = "requested_weight_details", columnDefinition = "NVARCHAR")
	private String requestedWeightDetails;

	@Column(name = "issued_weight_details", columnDefinition = "NVARCHAR")
	private String issuedWeightDetails;

	@Column(name = "selected_weight_details", columnDefinition = "NVARCHAR")
	private String selectedWeightDetails;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "issued_date")
	private Date issuedDate;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;
}