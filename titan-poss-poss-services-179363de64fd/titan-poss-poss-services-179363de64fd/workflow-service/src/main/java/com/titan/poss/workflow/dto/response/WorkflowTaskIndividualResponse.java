/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.response;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * DTO for Workflow Task Individual Response
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WorkflowTaskIndividualResponse {
	
	private String taskId;
	private String processId;
	private String taskName;
	private String requestorUserName;
	private String requestorRemarks;
	private Integer docNo;
	private String locationCode;
    private String approvalStatus;
	private int approvalLevel;	
	private JsonData approvedData;
	private JsonData headerData;
	private String requestorCode;
	private String approvedBy;
	private String approverCode;
	private Date requestedDate;
	private Date approvedDate;
}
