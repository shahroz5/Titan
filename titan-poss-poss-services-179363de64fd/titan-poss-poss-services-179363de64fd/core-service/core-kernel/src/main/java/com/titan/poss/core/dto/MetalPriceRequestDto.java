/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetalPriceRequestDto {

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX)
	private String metalType;

	@NotNull
	private Date applicableDate;

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX)
	private String locationCode;

	private String sortParam;

}
