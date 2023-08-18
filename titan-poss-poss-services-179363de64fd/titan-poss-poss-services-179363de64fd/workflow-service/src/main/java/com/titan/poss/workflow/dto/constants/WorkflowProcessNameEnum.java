/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.constants;

/**
 * Contains the Valid Key/Id of the BPMN Process 
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum WorkflowProcessNameEnum {
	
	
	// "WORKFLOWSERVICEL1" is Workflow Type with 1 Approval Level and is used as BPMN key to invoke Relevant BPMN
	// Similarly, for "WORKFLOWSERVICEL2", "WORKFLOWSERVICEL3" and "WORKFLOWSERVICEL4"
	// For DISCOUNTS Workflow, Email Approval is Required. "WORKFLOW_EMAILAPPR" is the BPMN Key for this Workflow.
	WORKFLOWSERVICEL1, WORKFLOWSERVICEL2, WORKFLOWSERVICEL3, WORKFLOWSERVICEL4, WORKFLOW_EMAILAPPR ;
	
	
}
