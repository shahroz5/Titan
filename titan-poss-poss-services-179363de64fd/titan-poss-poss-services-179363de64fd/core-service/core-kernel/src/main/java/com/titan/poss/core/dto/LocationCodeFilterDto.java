/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.List;
import java.util.Date;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LocationCodeFilterDto {

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCode;
	
	private Date offerStartDate;

	private Date offerEndDate;

	private Date previewStartDate;

	private Date previewEndDate;

}
