/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.workflow.dto.constants.TaskNameEnum;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class BulkApproverRequestObjectDto {
	
	@NotNull
	private Boolean approved;	

	@NotNull
	@Size(min=1, max=250)
	private String approverRemarks;
	
	@NotNull
	@PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid Task Id")
	private String taskId;
	
	@NotNull
	@PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid Process Id")
	private String processId;
	
	@NotNull
	@ValueOfEnum(enumClass = TaskNameEnum.class)
	private String taskName;	
	
}
