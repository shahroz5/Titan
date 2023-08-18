/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.response;

import lombok.Data;

/**
 * Response DTO Class to Get the LIST of Tasks assigned to the passed Candidate GROUPS
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CamundaGetLISTResponse {
	
	private String id;
	private String name;
	private String processInstanceId;
	
}
