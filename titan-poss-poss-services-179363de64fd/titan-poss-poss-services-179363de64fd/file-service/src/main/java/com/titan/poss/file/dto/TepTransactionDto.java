/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class TepTransactionDto {

	private String recType;
	private Integer lineNum;
	private String docType;
	private String item;
	private String qty;
	private String secQty;
	private BigDecimal unitPrice;
	private String vendorName;
	private String siteName;
	private String shipTo;
	private String billTo;
	private String itemAttribute;
	private String itemAttribute1;
	private String itemAttribute2;
	private String itemAttribute3;
	private BigDecimal itemAttribute4;
	private BigDecimal itemAttribute5;
	private BigDecimal itemAttribute6;
	private BigDecimal itemAttribute7;
	private String itemAttribute8;
	private BigDecimal itemAttribute9;
	private BigDecimal itemAttribute10;
	private BigDecimal itemAttribute11;
	private BigDecimal itemAttribute12;
	private BigDecimal itemAttribute13;
	private Integer recordId;
	private String btqId;
	private String businessDate;
	private BigDecimal igstPercentage;
	private BigDecimal igstValue;
	private BigDecimal sgstPercentage;
	private BigDecimal sgstValue;
	private BigDecimal cgstPercentage;
	private BigDecimal cgstValue;
	private BigDecimal utgstPercentage;
	private BigDecimal utgstValue;
	private String fileId;
	private String fileName;
	private String goodsExchangeId;
	private Date docDate;
}
