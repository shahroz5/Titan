/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.response;

import com.titan.poss.report.dto.request.AddReportRolesDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ReportRoleDto extends AddReportRolesDto {

	private String id;

	private String reportName;

	private String reportId;

	private String fromAccessTime;

	private String toAccessTime;

	private String roleCode;

	private String roleDescrption;

}
