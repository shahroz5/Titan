/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.constants;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum DayActivityStatusEnum {

	OPEN, BOD_IN_PROGRESS, EOD_IN_PROGRESS, CLOSED;

	public static List<String> getAllBusinessDayStatus() {
		return List.of(BOD_IN_PROGRESS.name(), OPEN.name(), EOD_IN_PROGRESS.name(), CLOSED.name());
	}

}
