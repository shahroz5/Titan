/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.List;

import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.sales.dto.response.FocItemResponseDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class FocResponseAndPublishDto {
	
	private List<FocItemResponseDto> focItemResponseDtoList;
	
	private SyncStagingDto syncStaging;
	
}
