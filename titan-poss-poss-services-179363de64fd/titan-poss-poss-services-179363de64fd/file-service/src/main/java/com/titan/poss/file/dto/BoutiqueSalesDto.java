/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class BoutiqueSalesDto {

	private String recType;

	private String hdrCustomerNo;
	private String hdrCustomerName;
	private String hdrOrderSource;
	private String hdrSysDocumentRef;
	private String hdrOrderType;
	private String hdrShipOrg;
	private String hdrPriceList;
	private String hdrSalesRep;
	private String hdrItemAttribute1;
	private String hdrItemAttribute2;
	private String hdrItemAttribute3;
	private Integer hdrItemAttribute4;
	private String hdrItemAttribute5;
	private String hdrItemAttribute6;
	private String hdrItemAttribute7;

	private Integer detDocNo;
	private String detSysDocumetRef;
	private Integer detSysLineRef;
	private Integer detShipmentRef;
	private String detInventoryItemRef;
	private String detCustLineNo;
	private String detOrdQty1;
	private String detOrdQty2;
	private String detUnitSellingPrice;
	private String detUnitListPrice;
	private String detScheduleDate;
	private String detPriceList;
	private String detShipFromOrg;
	private String detCalculatePrice;
	private BigDecimal detItemAttribute1;
	private String detItemAttribute2;
	private String detItemAttribute3;
	private String detItemAttribute4;
	private String detItemAttribute5;
	private String detItemAttribute6;
	private String detItemAttribute7;
	private String detItemAttribute8;
	private String detItemAttribute9;
	private BigDecimal detItemAttribute10;
	private BigDecimal detItemAttribute11;
	private Integer detItemAttribute12;
	private String detItemAttribute13;
	private String detItemAttribute14;
	private String detItemAttribute15;
	private String detIsCoin;
	private String detTxnType;
	private BigDecimal detOriginalQty;
	private BigDecimal detTotalQty;
	private Boolean detIsLegacyCm;

	private String taxSysDocumentRef;
	private Integer taxLineNo;
	private String taxName;
	private BigDecimal taxAmount;
	private String taxInventoryItem;
	private String taxLotNumber;
	private Integer lineNo;
	private Integer taxRecordId;
	private String taxLocationId;
	private String taxBusinessDate;
	private String taxFileName;
	private BigDecimal taxOtherCharges;
	private BigDecimal taxDiscountDetails;
	private BigDecimal taxGhsDiscount;
	private BigDecimal taxEncircleDiscount;
	private BigDecimal taxDigiGoldDiscount;

	private String fileId;

}
