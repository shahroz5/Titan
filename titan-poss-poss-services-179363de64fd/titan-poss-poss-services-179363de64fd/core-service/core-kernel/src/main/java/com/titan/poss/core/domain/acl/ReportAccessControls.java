/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.acl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public final class ReportAccessControls {

	private ReportAccessControls() {
		throw new IllegalArgumentException("ReportAccessControls class");
	}

	public static final String REPORT_MASTER_ADD_EDIT = "R0";
	public static final String REPORT_MASTER_VIEW = "R1";
	public static final String REPORT_GENERATION_ADD_EDIT = "R2";

}
