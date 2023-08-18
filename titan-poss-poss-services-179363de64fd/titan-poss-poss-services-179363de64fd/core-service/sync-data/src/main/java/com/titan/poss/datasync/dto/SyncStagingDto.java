/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import com.titan.poss.core.dto.MessageRequest;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class SyncStagingDto {

	private String id;

	private MessageRequest messageRequest;
}
