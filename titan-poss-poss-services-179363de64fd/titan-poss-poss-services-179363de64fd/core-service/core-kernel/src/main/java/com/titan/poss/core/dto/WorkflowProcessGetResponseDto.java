/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for getIndividualRecord API
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowProcessGetResponseDto {

	private String processId;
	private String workflowType;
	private JsonData approvedData;
	private JsonData headerData;
	private String locationCode;
	private String requestorUserName;
	private String requestorRemarks;
	private String approvalStatus;
	private Integer approvalLevel;
	private Integer docNo;
	private Short fiscalYear;
	private String approvedby;
	private Date approvedDate;
	private String approverRemarks;
	private String approverLocationCode;
	private String approverCode;
	private Date requestedDate;

}
