/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import lombok.Data;

/**
 * Process Var for Camunda Request Body
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CamundaProcessVarObjectforRequestBody {
	
	private String name;	
	private String value;	
	private String operator;

}
