/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReportListsDto {

	private Long id;

	private String reportMasterId;

	private String status;

	private String reportDescription;

	private String reportType;
}
