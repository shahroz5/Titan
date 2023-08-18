/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ReportMasterRequestDto {

	private String reportName;

	@PatternCheck(regexp = RegExConstants.REPORT_NAME_REGEX, nullCheck = true)
	private String reportDescription;

	@PatternCheck(regexp = RegExConstants.REPORT_TYPE_REGEX, nullCheck = true)
	private String reportType;

	private String reportGroup;

	@PatternCheck(regexp = RegExConstants.ACCESS_TYPE_REGEX, nullCheck = true)
	private String accessType;

	private String formatType;

	@PositiveOrZero(message = "max no of days should be 0 or more than 0")
	private Integer maxNoOfDays;

	@NotNull(message = "tbl content cannot be null")
	private Boolean tblContent;

	@PositiveOrZero(message = "lt margin should be 0 or more than 0")
	private Integer ltMargin;

	@PositiveOrZero(message = "rt margin should be 0 or more than 0")
	private Integer rtMargin;

	@PositiveOrZero(message = "tp margin should be 0 or more than 0")
	private Integer tpMargin;

	@PositiveOrZero(message = "bt margin should be 0 or more than 0")
	private Integer btMargin;

	@NotNull(message = "generation time cannot be null")
	private Integer regenerationTime;

	private Integer availabilityDays;

}
