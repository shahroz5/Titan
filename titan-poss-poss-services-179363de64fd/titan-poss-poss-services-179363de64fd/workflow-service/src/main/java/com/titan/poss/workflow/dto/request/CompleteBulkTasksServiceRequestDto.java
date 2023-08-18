/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.workflow.dto.response.CompleteTaskAllLevelsResponseDto;
import com.titan.poss.workflow.util.CompleteTaskAllLevels;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class CompleteBulkTasksServiceRequestDto {
	
	public CompleteTaskAllLevelsResponseDto completeBulkTasks(String approverRemarks, Boolean approved, String approverName, String processInstanceId, String taskId, String taskName, String camundaHostName) {
		if(!(taskId.matches(RegExConstants.UUID_REGEX))) {
			throw new ServiceException("INVALID Task ID. Please try with a valid one","ERR-WRFTASK-006");
		}
		
		if(!(processInstanceId.matches(RegExConstants.UUID_REGEX))) {
			throw new ServiceException("INVALID Process ID. Please try with a valid one","ERR-WRFPRC-007");
		}
		
				
		CompleteTaskAllLevelsResponseDto completeTaskAllLevels;
		
		CompleteTaskAllLevels completeTasks = new CompleteTaskAllLevels();
		
		completeTaskAllLevels = completeTasks.completeTask(approverRemarks, approved, approverName, taskId, processInstanceId, taskName, camundaHostName);
		
				
		return completeTaskAllLevels;
		
	}
}
