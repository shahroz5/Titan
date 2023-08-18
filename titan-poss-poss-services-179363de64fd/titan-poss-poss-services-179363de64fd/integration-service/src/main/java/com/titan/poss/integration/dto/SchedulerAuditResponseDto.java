/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SchedulerAuditResponseDto {

	private String schedulerCode;

	private Date schedulerRunTime;

	private String status;

	private Date startTime;

	private Date endTime;

	private long totalTime;

	private Boolean manualJob;
	
	private String exception;
}
