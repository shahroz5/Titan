/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GiftVoucherIndentStageDto {

	private String itemCode;

	private BigInteger gvSerialNo;

	private String issuedTo;

	private String region;

	private String customerName;

	private String customerType;

	private BigDecimal denomination;

	private Integer quantity;

	private BigDecimal totalValue;

	private Integer status;

	private Date gvCreationDate;

	private String locationCode;

	private BigDecimal discount;

	private String remarks;

	private String excludes;
	
	private String giftDetails;
	
	private String transitionStatus;

	private BigDecimal discountPercentage;

	private Integer validityDays;
	
	private Integer indentNo;

	private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;
	
	private String fileAuditId;
}
