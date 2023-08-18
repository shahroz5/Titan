/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.store.dao.PrinterConfigDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PrinterConfigSyncDto extends MasterSyncableEntity {

	private String id;

	private String hostname;

	private String locationCode;

	private String documentType;

	private String printerName;

	public PrinterConfigDao getPrinterConfigDao(PrinterConfigSyncDto syncDto) {
		return (PrinterConfigDao) MapperUtil.getObjectMapping(syncDto, new PrinterConfigDao());
	}
}
