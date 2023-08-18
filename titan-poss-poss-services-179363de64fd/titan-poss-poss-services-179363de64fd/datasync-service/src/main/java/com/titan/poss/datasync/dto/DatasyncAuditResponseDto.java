/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
public class DatasyncAuditResponseDto {

	private String id;
	private String destination; // Boutique code / EPOSS
	private String source;
	private String operation;
	private String dataflowDirection; // IN or OUT
	private String messageRefId; // SNS Message ID
	private String status;
	private String messageType;
	private String exception;
	private Long syncTime;

}
