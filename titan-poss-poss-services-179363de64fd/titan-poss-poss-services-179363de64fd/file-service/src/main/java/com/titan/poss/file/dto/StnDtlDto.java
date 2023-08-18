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
public class StnDtlDto {

	private String productGroup;
	private Integer slNo;
	private Date stmDate;
	private String orderType;
	private String productCode;
	private BigDecimal productValue1;
	private Integer productQty;
	private BigDecimal productWt;
	private BigDecimal productValue2;
	private String lotNumber;
	private BigDecimal actualF1;
	private BigDecimal diamondWt;
	private BigDecimal otherStoneWt;
	private String orderNo;
	private BigDecimal igstPerc;
	private BigDecimal igstVal;
	private BigDecimal sgstPerc;
	private BigDecimal sgstVal;
	private BigDecimal cgstPerc;
	private BigDecimal cgstVal;
	private BigDecimal utgstPerc;
	private BigDecimal utgstVal;
	private BigDecimal goNetWt;
	private BigDecimal ptNetWt;
	private BigDecimal stnNetWt;
	private BigDecimal siNetWt;
	private BigDecimal otherNetWt;
	private String fileId;
	private String createdBy;
	private Date createdDate;
	private String binCode;
	private String binGroupCode;
	private String taxDetails;
	private String issuedWeightDetails;
	private String itemDetails;
	private String productCategory;
}
