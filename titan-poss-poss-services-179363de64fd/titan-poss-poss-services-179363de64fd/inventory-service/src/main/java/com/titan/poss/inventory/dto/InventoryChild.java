/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;

import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class InventoryChild {
	private String id;
	private String itemCode;
	private String lotNumber;
	private String productCategory;
	private String productGroup;
	private String currencyCode;
	private String weightUnit;
	private Short issuedQuantity;
	private BigDecimal issuedWeight;
	private BigDecimal issuedValue;
	private BigDecimal stdValue;
	private BigDecimal stdWeight;
	private String inventoryId;
	private BigDecimal sgst;
	private BigDecimal cgst;
	private BigDecimal igst;
	private BigDecimal ugst;
	private BigDecimal itemTax;
	private BigDecimal finalValue;
	private String productType;
	private String hsnCode;
	private BigDecimal sgstPercentage;
	private BigDecimal cgstPercentage;
	private BigDecimal igstPercentage;
	private BigDecimal utgstPercentage;
	private BigDecimal amount;

	private BigDecimal taxValue;
	private BigDecimal taxPercentage;
	private Integer refDocNumber;
	private Date refDocDate;

	private String defectTypeDesc;
	private String defectCodeDesc;

	private BigDecimal itemTotalDiscount;
	private BigDecimal itemLevelDiscount;

	private Short receivedQuantity;
	private BigDecimal receivedWeight;
	private BigDecimal receivedValue;
	private BigDecimal totalTax;

}
