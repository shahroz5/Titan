/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto.response;

import java.util.List;

import com.titan.poss.datasync.dto.SyncStagingDto;

import lombok.Data;

/**
 *
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PublishResponse {
	private Object apiResponse;
	private SyncStagingDto syncStagingDto;
	private List<SyncStagingDto> syncStagingDtoList;
}
