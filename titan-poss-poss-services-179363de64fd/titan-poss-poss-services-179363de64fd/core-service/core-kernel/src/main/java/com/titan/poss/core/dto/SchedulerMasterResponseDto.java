/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

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
public class SchedulerMasterResponseDto {

	private String code;
	
	private String description;

	private String cronExpression;

	private Date lastRunTime;

	private Date nextRunTime;
	
	private String status;
	
	private String locationCode;
	
	private Date businessDate;
	
	private boolean isActive;
}
