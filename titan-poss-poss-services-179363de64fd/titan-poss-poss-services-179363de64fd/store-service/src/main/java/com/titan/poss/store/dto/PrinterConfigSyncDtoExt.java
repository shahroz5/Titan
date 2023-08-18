/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.store.dao.PrinterConfigDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PrinterConfigSyncDtoExt extends PrinterConfigSyncDto {
	public PrinterConfigSyncDtoExt() {

	}

	public PrinterConfigSyncDtoExt(PrinterConfigDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
	}
}
