/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import lombok.Data;

/**
 * DTO class to Prepare Request Body for Task Completion API for L3 Approver
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class TaskCompletionDtoL3 {
	private Object approverCommentsL3;
	private Object approvedL3;
	private Object approverNameL3;
}
