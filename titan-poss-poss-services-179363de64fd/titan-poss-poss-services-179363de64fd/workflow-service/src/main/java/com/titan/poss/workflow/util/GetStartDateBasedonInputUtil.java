/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import java.util.Date;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.workflow.dto.constants.DateEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class GetStartDateBasedonInputUtil {
	
	private static final String ERR_INV_013 = "ERR-INV-013";
	private static final String START_DATE_AND_END_DATE_NOT_NULL = "Start date and end date cannot be null";
		
	public Date getStartDateBasedOnInput(String date, Date startDate, Date endDate, Date startingDate) {
		if (DateEnum.TODAY.toString().equals(date)) {
			startingDate = CalendarUtils.getTodayStartDateAndTime();
		} else if (DateEnum.LAST_WEEK.toString().equals(date)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, -1, null, null);
		} else if (DateEnum.LAST_MONTH.toString().equals(date)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, -1, null);
		} else if (DateEnum.LAST_YEAR.toString().equals(date)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, null, -1);
		} else if (DateEnum.CUSTOM.toString().equals(date)) {
			if (startDate == null || endDate == null) {
				throw new ServiceException(START_DATE_AND_END_DATE_NOT_NULL, ERR_INV_013);
			}
			startingDate = startDate;
		}
		return startingDate;
	}
}
