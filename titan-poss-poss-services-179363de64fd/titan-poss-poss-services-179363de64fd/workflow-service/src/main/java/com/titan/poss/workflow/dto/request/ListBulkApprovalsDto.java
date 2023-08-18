/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ListBulkApprovalsDto {
		
	@NotEmpty(message = "Please provide other charge details")
	private List<@Valid BulkApproverRequestObjectDto> bulkApproverRequestObjectDto;	
}
