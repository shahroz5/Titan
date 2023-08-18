/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountLocationResponseDto {

	private String id;

	private Date offerStartDate;

	private Date offerEndDate;

	private Date previewStartDate;

	private Date previewEndDate;

	private String locationCode;

	private String description;

	private String subBrandCode;

	private Boolean status;

	private JsonData configDetails;

	private Boolean isDeletable;
}
