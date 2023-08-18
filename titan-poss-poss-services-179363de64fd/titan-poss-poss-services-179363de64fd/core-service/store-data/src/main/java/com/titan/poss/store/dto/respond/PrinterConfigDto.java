/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.dto.respond;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PrinterConfigDto {
	private String id;

	private String hostname;

	private String locationCode;

	private String documentType;

	private String printerName;

	private Boolean isActive;
}
