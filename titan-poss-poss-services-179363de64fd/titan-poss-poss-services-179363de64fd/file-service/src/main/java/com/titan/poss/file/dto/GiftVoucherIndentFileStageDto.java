/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GiftVoucherIndentFileStageDto {

	private String itemCode;

	private String gvSerialNumber;

	private String issuedTo;

	private String region;

	private String customerName;

	private String customerType;

	private String denomination;

	private String quantity;

	private String totalValue;

	private String status;

	private String gvCreationDate;

	private String locationCode;

	private String discount;

	private String remarks;

	private String excludes;

	private String discountPercentage;

	private String validityDays;

	private String createdBy;

	private String createdDate;

	private String lastModifiedBy;

	private String lastModifiedDate;

}
