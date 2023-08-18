/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dto.EinvoiceDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class InventoryHeader {

	// in case of other issues to and from will be same address
	private String locationAddress;

	// stock transfer memo number must be generated. will be unique for every print
	private String stmNumber;

	// GSTN API for getting GST (GSTIN,StateCoode,CIN)
	private Object gstObject;

	private Integer id;
	private String status;
	private Short totalIssuedQuantity;
	private BigDecimal totalIssuedValue;
	private String totalIssuedValueInWords;
	private BigDecimal totalIssuedWeight;

	private String weightUnit;
	private String currencyCode;
	private EinvoiceDto einvoice;
	private BigDecimal totalFinalValue;
	private BigDecimal totalStdValue;

	private BigDecimal totalStdWeight;
	
	private BigDecimal totalTax;
}
