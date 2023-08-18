/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DBQueryDto {
	private String approvalStatus;
	private String workflowType;
	private Integer docNo;
	private Short fiscalYear;
	private Date startingDate;
	private Date endingDate;
	private String filterParams;
}
