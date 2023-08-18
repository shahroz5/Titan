/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.dto.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class StoreConstants {

	public static final String INVALID_PRINTER = "Invalid printer name";
	
	public static final String ERR_STORE_001 = "ERR-STORE-001";
	public static final String RECORD_NOT_FOUND = "No  Printer Configured for this Doctype";

	public static final String ERR_STORE_002 = "ERR-STORE-002";
	public static final String RECORD_ALREADY_EXIST = "Record already exists.";
	
	public static final String ERR_STORE_003 = "ERR-STORE-003";
	public static final String PRINTER_ALREADY_EXIST = "Configuration already exists for the document type.";

	public static final String ERR_STORE_004 = "ERR-STORE-004";

}
