/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
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
 * @version 1.0
 */

@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "stock_transaction_details")
public class StockTransactionDetailsDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "mfg_date")
	private Date mfgDate;

	@Column(name = "issued_quantity")
	private Short issuedQuantity;

	@Column(name = "issued_value", columnDefinition = "DECIMAL")
	private BigDecimal issuedValue;

	@Column(name = "issued_weight", columnDefinition = "DECIMAL")
	private BigDecimal issuedWeight;

	@Column(name = "std_value", columnDefinition = "DECIMAL")
	private BigDecimal stdValue;

	@Column(name = "std_weight", columnDefinition = "DECIMAL")
	private BigDecimal stdWeight;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "bin_group_code")
	private String binGroupCode;

	@Column(name = "product_category")
	private String productCategory;

	@Column(name = "product_group")
	private String productGroup;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "currency_code")
	private String currencyCode;

	@Column(name = "status")
	private String status;

	@ManyToOne
	@JoinColumn(name = "stock_transaction_id")
	private StockTransactionDao stockTransaction;

	@Column(name = "issued_bin_code")
	private String issuedBinCode;

	@Column(name = "received_bin_code")
	private String receivedBinCode;

	@Column(name = "received_quantity")
	private Short receivedQuantity;

	@Column(name = "received_weight", columnDefinition = "DECIMAL")
	private BigDecimal receivedWeight;

	@Column(name = "remarks", columnDefinition = "NVARCHAR")
	private String remarks;

	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;

	@Column(name = "received_value", columnDefinition = "DECIMAL")
	private BigDecimal receivedValue;

	@Column(name = "issued_weight_details", columnDefinition = "NVARCHAR")
	private String issuedWeightDetails;

	@Column(name = "received_weight_details", columnDefinition = "NVARCHAR")
	private String receivedWeightDetails;

	@Temporal(TemporalType.DATE)
	@Column(name = "stock_inward_date")
	private Date stockInwardDate;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "total_tax", columnDefinition = "decimal")
	private BigDecimal totalTax;
	
	@Column(name = "defect_code_desc", columnDefinition = "NVARCHAR")
	private String defectCodeDesc;
	
	@Column(name = "defect_type_desc", columnDefinition = "NVARCHAR")
	private String defectTypeDesc;

}
