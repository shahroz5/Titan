package com.titan.poss.workflow.dto.response;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Response DTO for GET LIST API
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowProcessListDto {

	private String processId;
	private String workflowType;
	private JsonData headerData;
	private String approvalStatus;	
	private Integer approvalLevel;
	private Integer docNo;
	private Short fiscalYear;
	private String requestorRemarks;
	private String requestedBy;
	private Date requestedDate;
	private String approvedBy;
	private Date approvedDate;
	private String approverRemarks;
	private String requestorCode;
	private String approverCode;
}
