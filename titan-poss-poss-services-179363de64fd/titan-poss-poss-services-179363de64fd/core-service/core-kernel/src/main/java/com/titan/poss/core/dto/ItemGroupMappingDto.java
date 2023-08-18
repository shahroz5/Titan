/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ItemGroupMappingDto {

	private String id;

	private String discountId;

	private String itemCode;

	private String lotNumber;

	private String description;

	private String locationCode;

	private Date startDate;

	private Date endDate;

	private Date previewStartDate;

	private Date previewEndDate;

	private Boolean isTransferredLocation;

	private Boolean isPreviewApplicable;

	private Boolean isActive;

	private JsonData regularConfigDetails;

	private JsonData previewConfigDetails;

	private Boolean isDeletable;

}
