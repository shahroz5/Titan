/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SchedulerResponseDto {

	private String code;
	
	private Integer responseCode;
	
	private String status;
	
	private String failureMessage;
}
