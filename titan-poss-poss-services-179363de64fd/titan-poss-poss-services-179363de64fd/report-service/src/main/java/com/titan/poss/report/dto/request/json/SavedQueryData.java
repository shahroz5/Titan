/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request.json;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class SavedQueryData extends BaseFieldsValidator {

	private String reportType;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_LOV_CODE_REGEX) String> ownerType;

	private List<@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String> subBrandCode;

	@PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX)
	private String countryCode;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String stateId;

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> townId;

	private  List<@PatternCheck(regexp = RegExConstants.REGION_CODE_REGEX) String> subRegionCode;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCode;

	}
