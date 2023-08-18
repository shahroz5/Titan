/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * Response DTO for Create Process API
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WorkflowProcessCreateResponseDto {
	
	private String processId;
	private String workflowType;
	private JsonData requestData;
	private String locationCode;	
	private String approvalStatus;
	private int approvalLevel;
	private String requestorUserName;	
	private Integer docNo;
	private Short fiscalYear;
	private String requestedBy;
	private Date requestedDate;
	private String requestorRemarks;	
	private String requestorCode;
}
