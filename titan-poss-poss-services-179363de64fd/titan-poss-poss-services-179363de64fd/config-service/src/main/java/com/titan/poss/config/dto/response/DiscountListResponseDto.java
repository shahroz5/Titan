/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountListResponseDto {

	private String id;

	private String discountCode;

	private String description;

	private String approvedBy;

	private String discountType;

	private String occasion;

	private String subBrandCode;

	private String brandCode;

	private String applicableLevels;

	private String remarks;

	private Boolean isActive;

	private String clubbingDiscountType;

	private Date createdDate;

	private Date publishTime;

	private Boolean isPublishPending;

	private Date lastModifiedDate;

	private String status;

	private String lastModifiedBy;

	private Boolean isCreatedByWorkflow;

}
