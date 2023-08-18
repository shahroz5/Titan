/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import lombok.Data;

/**
 * DTO class to Prepare Request Body for Task Completion API for L2 Approver
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TaskCompletionDtoL2 {
	private Object approverCommentsL2;
	private Object approvedL2;
	private Object approverNameL2;
}
