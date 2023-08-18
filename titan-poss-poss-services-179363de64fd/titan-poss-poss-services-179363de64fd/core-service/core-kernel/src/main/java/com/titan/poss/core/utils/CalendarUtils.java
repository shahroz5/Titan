
/*  Copyright 2019. Titan Company Limited
All rights reserved.
*/
package com.titan.poss.core.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.Year;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.EnumMap;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import com.google.gson.JsonElement;
import com.titan.poss.core.exception.ServiceException;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
public class CalendarUtils {

	private static Map<Month, String> monthMap = new EnumMap<>(Month.class);

	private CalendarUtils() {
		throw new IllegalArgumentException("CalendarUtils class");
	}

	@Value("${poss.fiscal-year.starting-month:4}")
	private static int fiscalYearStartingMonth;

	@Value("${poss.fiscal-year.offset:0}")
	private static int fiscalYearOffset;

	static {
		monthMap.put(Month.JANUARY, "JAN");
		monthMap.put(Month.FEBRUARY, "FEB");
		monthMap.put(Month.MARCH, "MAR");
		monthMap.put(Month.APRIL, "APR");
		monthMap.put(Month.MAY, "MAY");
		monthMap.put(Month.JUNE, "JUN");
		monthMap.put(Month.JULY, "JUL");
		monthMap.put(Month.AUGUST, "AUG");
		monthMap.put(Month.SEPTEMBER, "SEP");
		monthMap.put(Month.OCTOBER, "OCT");
		monthMap.put(Month.NOVEMBER, "NOV");
		monthMap.put(Month.DECEMBER, "DEC");
	}

	public static int getCurrentYear() {
		return Year.now().getValue();
	}
	
	public static int getYearOfDate(Date date) {
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);

		return cal.get(Calendar.YEAR);
	}

	private static final String DEFAULT_DATE_FORMAT = "dd-MM-yyyy hh:mm:ss a";
	
	private static final String SQL_DEFAULT_DATE_FORMAT = "yyyy-MM-dd hh:mm:ss a";

	public static final String SQL_DATE_FORMAT = "yyyy-MM-dd";
	public static final String DISPLAY_DATE_FORMAT = "dd-MMM-yyyy";

	public static final String DD_MM_YY_HYPHEN = "dd-MM-yy";
	public static final String YYYYMMDD = "yyyyMMdd";
	public static final String PRINTABLE_DATE_FORMAT = "dd/MM/yy";
	public static final String PRINTABLE_DATE_FORMAT_DD_MM_YYYY = "dd/MM/yyyy";

	private static final Logger LOGGER = LoggerFactory.getLogger(CalendarUtils.class);

	public static Date calendarFor(int year, int month, int day) {
		Calendar cal = new GregorianCalendar();
		cal.set(year, month - 1, day);
		return cal.getTime();
	}

	public static Date calendarFor(int year, int month, int day, int hr, int min, int sec) {
		Calendar cal = new GregorianCalendar();
		cal.set(year, month - 1, day, hr, min, sec);
		return cal.getTime();
	}

	public static Date getCurrentDate() {
		return Calendar.getInstance().getTime();
	}

	public static Date getCurrentStartDate() {
		Calendar startDate = Calendar.getInstance();
		startDate.set(startDate.get(Calendar.YEAR), startDate.get(Calendar.MONTH), startDate.get(Calendar.DAY_OF_MONTH),
				0, 0, 0);
		return startDate.getTime();
	}

	public static long getDayDiff(Date startDate, Date endDate) {

		long diffInMillies = endDate.getTime() - startDate.getTime();
		return TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
	}

	// *** Please use Engine service to get fiscal year

	public static Date getPreviousFiscalStartDate() {
		return calendarFor(getCurrentFiscalYear() - 1, fiscalYearStartingMonth - 1, 01, 00, 00, 00); // 1st April,
																										// 00:00:00 last
																										// year
	}

	public static Date getPreviousFiscalEndDate() {
		return calendarFor(getCurrentFiscalYear(), fiscalYearStartingMonth - 2, 31, 23, 59, 59); // 31st March, 11:59:59
	}

	public static Date getCurrentFiscalStartDate() {
		return calendarFor(getCurrentFiscalYear(), fiscalYearStartingMonth - 1, 01, 00, 00, 00); // 1st April, 00:00:00
																									// this year
	}

	public static Date addTimeToCurrentTime(Integer min, Integer hour, Integer day, Integer week, Integer month,
			Integer year) {

		return addTimeToDate(Calendar.getInstance().getTime(), min, hour, day, week, month, year);
	}

	public static Date addTimeToDate(Date date, Integer min, Integer hour, Integer day, Integer week, Integer month,
			Integer year) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		if (min != null)
			cal.add(Calendar.MINUTE, min);
		if (hour != null)
			cal.add(Calendar.HOUR, hour);
		if (day != null)
			cal.add(Calendar.DATE, day);
		if (week != null)
			cal.add(Calendar.WEEK_OF_MONTH, week);
		if (month != null)
			cal.add(Calendar.MONTH, month);
		if (year != null)
			cal.add(Calendar.YEAR, year);

		return cal.getTime();
	}

	public static Date addNnoOfDays(int day, Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DAY_OF_MONTH, day);
		return cal.getTime();
	}

	public static Date setSecondTo59(Date dateIp) {
		Calendar date = Calendar.getInstance(Locale.getDefault());
		date.setTime(dateIp);
		date.set(Calendar.SECOND, 59);
		return date.getTime();
	}

	// *** Please use engine API to get current fiscal year

	public static int getCurrentFiscalYear() {
		int month = LocalDateTime.now().getMonth().getValue();
		int advance = (month < fiscalYearStartingMonth) ? -1 : 0;
		return Year.now().getValue() + advance + fiscalYearOffset;
	}
	

	public static long getMidnightTime(int offsetHours) {
		Calendar date = Calendar.getInstance(Locale.getDefault());
		date.set(Calendar.HOUR_OF_DAY, 0);
		date.set(Calendar.MINUTE, 0);
		date.set(Calendar.SECOND, 0);
		date.set(Calendar.MILLISECOND, 0);
		date.add(Calendar.DAY_OF_MONTH, 1);
		date.add(Calendar.HOUR_OF_DAY, offsetHours);
		return date.getTimeInMillis();
	}

	public static Date getDate(int year, int month, int day) {
		Calendar cal = Calendar.getInstance(Locale.getDefault());
		cal.set(Calendar.YEAR, year);
		cal.set(Calendar.MONTH, month - 1);
		cal.set(Calendar.DAY_OF_MONTH, day);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}

	public static Date getTOdaysDocDate() {
		Calendar cal = Calendar.getInstance(Locale.getDefault());
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}

	public static String formatDateToString(Date date, String format) {
		return new SimpleDateFormat(format).format(date);
	}

	public static String formatDetfaultToStr(Date date) {
		return new SimpleDateFormat(DEFAULT_DATE_FORMAT).format(date);
	}
	
	public static String formatSqlDetfaultToStr(Date date) {
		return new SimpleDateFormat(SQL_DEFAULT_DATE_FORMAT).format(date);
	}

	public static String formatDateToSql(Date date) {
		return new SimpleDateFormat(SQL_DATE_FORMAT).format(date);
	}

	public static String formatToDisplayDate(Date date) {
		return new SimpleDateFormat(DISPLAY_DATE_FORMAT).format(date);
	}

	public static String formatToPrintableDate(Date date) {
		return new SimpleDateFormat(PRINTABLE_DATE_FORMAT).format(date);
	}
	
	public static String formatStringToDefaultSqlDateFormat(String date) {
	     return new SimpleDateFormat(SQL_DATE_FORMAT).format(date);
	}

	public static Date formatDetfaultToDate(String str) {
		Date date = null;
		if (StringUtils.isBlank(str))
			return date;
		try {
			date = new SimpleDateFormat(DEFAULT_DATE_FORMAT).parse(str);
		} catch (ParseException e) {
			LOGGER.error("Provided date format is invalid: {}", DEFAULT_DATE_FORMAT);
		}
		return date;
	}

	public static Date formatDetfaultToDateStr(String str) {
		Date date = null;
		if (StringUtils.isBlank(str))
			return date;
		try {
			date = new SimpleDateFormat(SQL_DATE_FORMAT).parse(str);
		} catch (ParseException e) {
			LOGGER.error("Provided date format is invalid: {}", DEFAULT_DATE_FORMAT);
		}
		return date;
	}

	public static long getHourDifference(Date startDate, Date endDate) {
		return TimeUnit.MILLISECONDS.toHours((endDate.getTime() - startDate.getTime()));
	}

	public static long getMinutesDifference(Date startDate, Date endDate) {
		return TimeUnit.MILLISECONDS.toMinutes((endDate.getTime() - startDate.getTime()));
	}

	public static Date getTodayStartDateAndTime() {

		return getStartOfDay(new GregorianCalendar().getTime());

	}

	public static Date getStartOfDay(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();
	}

	public static Date getTodayEndDateAndTime() {

		return getEndOfDay(new GregorianCalendar().getTime());

	}

	public static Date getEndOfDay(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		cal.set(Calendar.MILLISECOND, 999);
		return cal.getTime();
	}

	public static String simpleDateFormat() {
		LocalDateTime ldt = LocalDateTime.now();
		return DateTimeFormatter.ofPattern(SQL_DATE_FORMAT, Locale.ENGLISH).format(ldt);

	}

	public static Date convertStringToDate(String dateString, String format) {
		return convertStringToDate(dateString, format, null);
	}

	public static Date convertStringToDate(String dateString, String format, String fieldName) {
		Date date = null;
		try {
			date = new SimpleDateFormat(format).parse(dateString);
		} catch (ParseException e) {
			throw new ServiceException("Exception while parsing the date", "ERR-CORE-028", fieldName);
		}
		return date;
	}

	/**
	 * This method will return true if provided date is of today, or else false. If
	 * passed null, it will return false.
	 * 
	 * @param date
	 * @return
	 */
	public static boolean isProvidedDateIsWithinToday(Date date) {

		boolean isValid = true;

		if (date == null || date.before(getTodayStartDateAndTime()) || date.after(getTodayEndDateAndTime()))
			isValid = false;

		return isValid;
	}

	public static LocalDate convertStringToLocalDate(String dateString, String format) {
		LocalDate date = null;
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
		try {
			date = LocalDate.parse(dateString, formatter);
		} catch (Exception e) {
			throw new ServiceException("Exception while parsing the date", "ERR-CORE-028", format);
		}
		return date;
	}

	public static boolean isBefore(Date date1, Date date2) {
		return (date1 != null && date2 != null && date1.before(date2));
	}

	public static String getCurrentHourAndMinute() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.HOUR_OF_DAY) + ":" + calendar.get(Calendar.MINUTE);
	}

	public static String getCurrentHourAndMinuteAndSecond() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.HOUR_OF_DAY) + ":" + calendar.get(Calendar.MINUTE) + ":"
				+ calendar.get(Calendar.SECOND);
	}

	/**
	 * This method will return the incremented date by 1.
	 * 
	 * @param businessDate
	 * @return Date
	 */
	public static Date addDate(Date businessDate, int noOfDays) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(businessDate);
		calendar.add(Calendar.DATE, noOfDays);
		return java.sql.Date.valueOf(new SimpleDateFormat(SQL_DATE_FORMAT).format(calendar.getTime()));
	}

	/**
	 * This method will return the today Date.
	 * 
	 * @return Date
	 */
	public static Date getTodayDate() {

		return java.sql.Date
				.valueOf(LocalDate.parse(DateTimeFormatter.ofPattern(SQL_DATE_FORMAT).format(ZonedDateTime.now()),
						DateTimeFormatter.ofPattern(SQL_DATE_FORMAT)));
	}

	public static boolean beforeOrNow(Date startTime, Date endTime) {

		long startTimeMilli = startTime.getTime();
		long endTimeMilli = endTime.getTime();

		boolean isValid = false;

		if (startTimeMilli <= endTimeMilli)
			isValid = true;

		return isValid;
	}

	public static boolean afterOrNow(Date startTime, Date endTime) {

		long startTimeMilli = startTime.getTime();
		long endTimeMilli = endTime.getTime();

		boolean isValid = false;

		if (startTimeMilli >= endTimeMilli)
			isValid = true;

		return isValid;
	}

	public static Date convertLocalDateTimeToDateUsingInstant(LocalDateTime dateToConvert) {
		return java.util.Date.from(dateToConvert.atZone(ZoneId.systemDefault()).toInstant());
	}

	public static String getCurrentDayFiscalYearMonth() {
		return monthMap.get(LocalDate.now().getMonth());
	}

	public static LocalDate convertDateToLocalDate(Date dateToConvert) {
		return dateToConvert.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	}

	/*
	 * This method takes java Date Object as argument and returns EPOCH millisecond
	 * of the date at 12 mid night which is start of the day.
	 */
	public static long convertDateToStartOftheDayEpoch(Date dateToConvert) {
		LocalDate localDate = dateToConvert.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		Instant instant = localDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
		return instant.toEpochMilli();
	}

	public static long convertLocalDateTimeToEpoch(LocalDateTime localDateTime) {
		return localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
	}

	/**
	 * This method will add time zone part to current date. It will be used in
	 * inter-service to add offset to input date so that after @JsonFormat trimming,
	 * it will still show required date
	 * 
	 * <br/>
	 * <br/>
	 * For e.g, for India it will add 330 minutes (+ 5 : 30)
	 * 
	 * <br/>
	 * 19/05/2021 00:00 to 19/05/2021 05:30
	 * 
	 * @param date
	 * @return date
	 */
	public static Date addOffSetTimeZone(Date date) {

		TimeZone timeZone = Calendar.getInstance().getTimeZone();
		long offset = timeZone.getOffset(date.getTime()) / (1000 * 60);
		return new Date(date.getTime() + offset * 60 * 1000);
	}

	/**
	 * This method will return the quarter to which the date belongs to
	 * 
	 * Apr 1st to Jun 30th - Q1 July 1st to Sep 30th -Q2 Oct 1st to Dec 31st - Q3
	 * Jan 1st to Mar 31st - Q4
	 * 
	 * @param date
	 * @return int
	 */
	public static int getQuarterFromDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int month = calendar.get(Calendar.MONTH);
		if (month == 0 || month == 1 || month == 2) {
			return 4;
		} else if (month == 3 || month == 4 || month == 5) {
			return 1;
		} else if (month == 6 || month == 7 || month == 8) {
			return 2;
		} else {
			return 3;
		}
	}

	public static Date getFirstDayOfQuarter(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.set(Calendar.MONTH, getFirstMonthOfTheQuarter(date));
		return calendar.getTime();
	}

	public static Date getLastDayOfQuarter(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.MONTH, getLastMonthOfTheQuarter(date));
		calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		return calendar.getTime();
	}

	public static int getFirstMonthOfTheQuarter(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int month = calendar.get(Calendar.MONTH);
		if (month == 0 || month == 1 || month == 2) {
			return 0;
		} else if (month == 3 || month == 4 || month == 5) {
			return 3;
		} else if (month == 6 || month == 7 || month == 8) {
			return 6;
		} else {
			return 9;
		}
	}

	public static int getLastMonthOfTheQuarter(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int month = calendar.get(Calendar.MONTH);
		if (month == 0 || month == 1 || month == 2) {
			return 2;
		} else if (month == 3 || month == 4 || month == 5) {
			return 5;
		} else if (month == 6 || month == 7 || month == 8) {
			return 8;
		} else {
			return 11;
		}
	}

	public static boolean isValidDate(String date, String format) {
		if (date == null)
			return false;
		try {
			parse(date, format);
		} catch (java.text.ParseException e) {
			return false;
		}
		return true;
	}

	public static Date parse(String date) throws java.text.ParseException {
		// Modified by Aris on 02/02/2009 for case 1296351
		// if ( date == null || date.length()==0) return null;
		if (date == null)
			return null;
		String dateformat = null;
		// Use the default format of "dd/MM/yyyy".
		dateformat = SQL_DATE_FORMAT;
		return parse(date, dateformat);
	}

	public static Date parse(String date, String format) throws java.text.ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		sdf.setLenient(false);
		return sdf.parse(date);
	}
	
	public static String getParsedDateEpochToDateFormat(Long dateValue) {
		String dateTimeFormat="";
		try {
			Date dateToReturn = CalendarUtils.convertStringToDate(
					new SimpleDateFormat(SQL_DATE_FORMAT).format(java.sql.Date
							.valueOf(Instant.ofEpochMilli(dateValue).atZone(ZoneId.systemDefault()).toLocalDate())),
					SQL_DATE_FORMAT);
			dateTimeFormat = new SimpleDateFormat(SQL_DATE_FORMAT).format(dateToReturn);
					
		} catch (Exception e) {
			log.info("While Convering epoch date to date format {}", e.getMessage());
		}
		return dateTimeFormat;
	}
	
}
