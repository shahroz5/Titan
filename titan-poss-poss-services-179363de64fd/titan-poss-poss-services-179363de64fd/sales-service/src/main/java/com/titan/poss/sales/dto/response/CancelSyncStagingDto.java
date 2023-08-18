/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Map;

import com.titan.poss.datasync.dto.SyncStagingDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CancelSyncStagingDto extends SyncStagingDto {
	private Map<String, Integer> docNos;
	private Map<String, String> cNDocTypes;
}
