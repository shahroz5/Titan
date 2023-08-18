/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * Handles List of Paginated Response for Approver
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class WorkflowTaskListDto {
	private String taskId;
	private String taskName;
	private String processId;
	private JsonData headerData;
	private String workflowType;
	private Integer docNo;
	private Date docDate;
	private Short fiscalYear;
	private String locationCode;
	private String requestorRemarks;
	private String requestedBy;
	private Date requestedDate;
	private String approvedBy;
	private Date approvedDate;
	private String approverRemarks;
	private String approvalStatus;
	private String requestorCode;
	private String approverCode;
	private JsonData approvedData;
}
