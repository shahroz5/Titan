/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import lombok.Data;

/**
 * DTO class to Prepare Request Body for Task Completion API for L1 Approver
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TaskCompletionDtoL1 {
	private Object approverCommentsL1;
	private Object approvedL1;
	private Object approverNameL1;
}
