/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.constants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public final class HardCodedConstants {

	private HardCodedConstants() {
		throw new IllegalArgumentException("HardCodedConstants");
	}

	// DB LENGTH IS 2000
	public static final Integer RESPONSE_LENGTH = 2000 - 80;
	public static final String FILE_BASE_FOLDER = "db.backup.files.path";

}
