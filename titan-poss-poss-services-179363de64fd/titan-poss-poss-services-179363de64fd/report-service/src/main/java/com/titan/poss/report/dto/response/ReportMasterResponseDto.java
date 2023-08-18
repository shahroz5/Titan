/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.response;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ReportMasterResponseDto {

	private String id;

	private String reportName;

	private String reportDescription;

	private String reportType;

	private String reportGroup;

	private String formatType;

	private Integer maxNoOfDays;

	private Boolean isMappedToTheRole;

}
