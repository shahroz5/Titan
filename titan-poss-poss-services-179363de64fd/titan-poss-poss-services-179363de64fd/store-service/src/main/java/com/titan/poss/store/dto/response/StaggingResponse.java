/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.dto.response;

import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.store.dao.PrinterConfigDaoExt;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StaggingResponse {
	private SyncStagingDto staggingDto;
	private PrinterConfigDaoExt printerConfigDaoExt;
}
