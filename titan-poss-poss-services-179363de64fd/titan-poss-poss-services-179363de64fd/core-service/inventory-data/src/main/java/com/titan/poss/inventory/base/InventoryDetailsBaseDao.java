/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class InventoryDetailsBaseDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "bin_code")
	private String binCode;

	@Column(name = "bin_group_code")
	private String binGroupCode;

	@Column(name = "previous_bin_code")
	private String previousBinCode;

	@Column(name = "previous_bin_group_code")
	private String previousBinGroupCode;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "lot_number")
	private String lotNumber;

	@Column(name = "serial_number")
	private String serialNumber;

	@Column(name = "total_quantity")
	private Short totalQuantity;

	@Column(name = "issued_quantity")
	private Short issuedQuantity;

	@Column(name = "total_weight", columnDefinition = "DECIMAL")
	private BigDecimal totalWeight;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "currency_code")
	private String currencyCode;

	@Temporal(TemporalType.DATE)
	@Column(name = "mfg_date")
	private Date mfgDate;

	@Column(name = "total_value", columnDefinition = "DECIMAL")
	private BigDecimal totalValue;

	@Column(name = "product_category")
	private String productCategory;

	@Column(name = "product_group")
	private String productGroup;

	@Column(name = "std_weight", columnDefinition = "DECIMAL")
	private BigDecimal stdWeight;

	@Column(name = "std_value", columnDefinition = "DECIMAL")
	private BigDecimal stdValue;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "bin_modified_date")
	private Date binModifiedDate;

	@Column(name = "item_details", columnDefinition = "NVARCHAR")
	private String itemDetails;

	@Column(name = "weight_modified_count")
	private Short weightModifiedCount;

	@Column(name = "org_code")
	private String orgCode;

	@Column(name = "total_weight_details", columnDefinition = "NVARCHAR")
	private String totalWeightDetails;

	@Temporal(TemporalType.DATE)
	@Column(name = "stock_inward_date")
	private Date stockInwardDate;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	@Column(name = "doc_number")
	private Integer docNumber;

	@Column(name = "fiscal_year ")
	private Short fiscalYear;

	@Column(name = "doc_type")
	private String docType;

	@Column(name = "action_type")
	private String actionType;

	@Column(name = "isac_details", columnDefinition = "NVARCHAR")
	private String isacDetails;
	
	@Column(name ="is_hallmarked")
	private Boolean isHallmarked;
	
	@Column(name = "karat", columnDefinition = "decimal")
	private BigDecimal karat;
	
	@Column(name = "defect_code_desc")
	private String defectCodeDesc;
	
	@Column(name = "defect_type_desc")
	private String defectTypeDesc;
	
	@Column(name ="request_type")
	private String requestType;
	
	@Column(name ="request_quantity")
	private Short requestQuantity;
	
	@Column(name = "item_discount", columnDefinition = "decimal")
	private BigDecimal itemDiscount;
	
	@Column(name = "making_charges", columnDefinition = "decimal")
	private BigDecimal makingCharges;
	
	@Column(name = "making_charges_pct", columnDefinition = "decimal")
	private BigDecimal makingChargesPct;
}
