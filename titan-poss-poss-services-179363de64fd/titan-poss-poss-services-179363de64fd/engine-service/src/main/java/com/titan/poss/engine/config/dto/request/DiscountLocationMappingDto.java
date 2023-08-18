/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.config.dto.request;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DiscountLocationMappingDto {

	private String discountCode;

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX)
	private String locationCode;

	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private Date startDate;

	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private Date endDate;
}
