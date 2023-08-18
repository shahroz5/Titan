/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;
import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@EqualsAndHashCode
@ToString
public class ReportRequestDto {
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date fromDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date toDate;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_LOV_CODE_REGEX) String> ownerType;

	private List<@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String> brandCode;

	private List<@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String> subBrandCode;

	private List<@PatternCheck(regexp = RegExConstants.REGION_CODE_REGEX) String> subRegionCode;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String stateId;

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> townId;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCode;

	@PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX)
	private String countryId;

	private JsonData customFields;

	@JsonIgnore
	private String reportId;

	@JsonIgnore
	private String authorizationHeader;

	@JsonIgnore
	private String authorizationCookie;
}
