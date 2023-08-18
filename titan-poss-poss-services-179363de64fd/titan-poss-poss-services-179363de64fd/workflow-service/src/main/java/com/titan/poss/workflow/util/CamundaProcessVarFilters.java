/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CamundaProcessVarFilters {
	
	private String workflowType;
	
	private List<String> candidateGroups;
	
	private int firstResult;
	
	private int maxResults;
	
	private Map<String,String> filterParams;
	
	private String createdAfter;
	
	private String createdBefore;
	
	private String camundaHostName;
	
}
