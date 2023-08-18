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
public class IbtStbHdrDto {

	private String location;
	private String productGroupCode;
	private Integer transferType;
	private Integer deliveryNo;
	private String stmDate;
	private String factoryCode;
	private Integer shipQty;
	private BigDecimal shipQty2;
	private BigDecimal stmValue;
	private String carrierName;
	private String createdBy;
	private String stmCreatedDate;
	private Date stmCreatedTime;
	private String modifiedBy;
	private String docketNumber;
	private String fileId;
	private Integer createdYear;
	private Date createdDate;
	private String carrierDetails;
	private String stockTransferType;
}
