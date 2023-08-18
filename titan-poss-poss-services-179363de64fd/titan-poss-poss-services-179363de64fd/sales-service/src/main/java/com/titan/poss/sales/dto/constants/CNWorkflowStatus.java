/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum CNWorkflowStatus {
	PENDING_FOR_CANCEL, PENDING_FOR_TRANSFER, PENDING_FOR_ACTIVATE, REQUEST_CANCEL, REJECTED, PENDING_FOR_RATE_REMOVAL,
	APPROVED;

	public static List<String> getOnlyWorkFlowStatus() {
		List<String> workflowStatuses = new ArrayList<>();
		workflowStatuses.add(PENDING_FOR_CANCEL.toString());
		workflowStatuses.add(PENDING_FOR_TRANSFER.toString());
		workflowStatuses.add(PENDING_FOR_ACTIVATE.toString());
		workflowStatuses.add(PENDING_FOR_RATE_REMOVAL.toString());
		return workflowStatuses;
	}
}
