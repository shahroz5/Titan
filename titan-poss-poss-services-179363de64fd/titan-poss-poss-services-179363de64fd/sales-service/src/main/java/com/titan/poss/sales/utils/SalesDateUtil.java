/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import org.springframework.util.StringUtils;

import com.titan.poss.core.enums.DateEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public final class SalesDateUtil {

	private SalesDateUtil() {
		throw new IllegalArgumentException("Sales Date Util class");
	}

	private static final String ERR_CORE_034 = "ERR-CORE-034";
	private static final String INVALID_REQUEST_DATA = "Invalid request data";

	public static Date getStartDateBasedOnInput(String dateRangeType, Date startDate, Date endDate) {

		Date startingDate = null;

		if (StringUtils.isEmpty(dateRangeType) || DateEnum.TODAY.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.getTodayStartDateAndTime();
		} else if (DateEnum.LAST_WEEK.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, -1, null, null);
		} else if (DateEnum.LAST_MONTH.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, -1, null);
		} else if (DateEnum.LAST_YEAR.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, null, -1);
		} else if (DateEnum.CUSTOM.toString().equals(dateRangeType)) {
			if (startDate == null || endDate == null) {
				throw new ServiceException(INVALID_REQUEST_DATA, ERR_CORE_034,
						"Please provide start date and end date");
			}
			startingDate = startDate;
		}
		return startingDate;
	}

	public static Date getStartDateBasedOnInputDate(String dateRangeType, Date startDate, Date endDate,
			Date businessDate) {

		Date startingDate = null;

		if (StringUtils.isEmpty(dateRangeType) || DateEnum.TODAY.toString().equals(dateRangeType)) {
			startingDate = businessDate;
		} else if (DateEnum.LAST_WEEK.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToDate(businessDate, null, null, null, -1, null, null);
		} else if (DateEnum.LAST_MONTH.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToDate(businessDate, null, null, null, null, -1, null);
		} else if (DateEnum.LAST_YEAR.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToDate(businessDate, null, null, null, null, null, -1);
		} else if (DateEnum.CUSTOM.toString().equals(dateRangeType)) {
			if (startDate == null || endDate == null) {
				throw new ServiceException(INVALID_REQUEST_DATA, ERR_CORE_034,
						"Please provide start date and end date");
			}
			startingDate = startDate;
		}
		return startingDate;
	}

	public static String convertDateFormat(Date docDate) {
		 DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		 LocalDate localDate = LocalDate.parse(docDate.toString(), inputFormatter);
		 DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd/MM/YYYY");
		 return outputFormatter.format(localDate);
	}
}
