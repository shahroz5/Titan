/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import java.util.List;

import lombok.Data;

/**
 * RequestBody for Camunda API to Get LIST and Count for Pending Status for given Candidate Groups (1 Approver user has a List of Roles) 
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CamundaRequestBodyforListandCount {
	
	private List<Object> processVariables;
	
	private List<String> candidateGroups;
	
	private String createdAfter;
	
	private String createdBefore;
}
