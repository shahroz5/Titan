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
public class ReportFieldsRoleMappingDto {

	private String id;

	private String reportMasterId;

	private String reportFieldId;

	private String roleCode;

	private Boolean isExcluded;

	private Boolean isMasked;

	private String fieldName;

}
