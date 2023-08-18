/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CustomExceptionMessageUtil {

	private CustomExceptionMessageUtil() {
		throw new IllegalArgumentException("CustomExceptionMessageUtil class");
	}

	public static String getErrorCauseMessage(Exception e) {
		String errorCause = null;
		if (CommonUtil.isDev()) {

			if (e.getClass().equals(NullPointerException.class))
				errorCause = "Null Pointer Exception";
			else
				errorCause = subStringErrorMssg(e.getLocalizedMessage());
		}
		return errorCause;

	}

	private static String subStringErrorMssg(String errCauseStr) {

		// check if any case is handled then trim message else full one

		// @formatter:off
		// com.netflix.client.ClientException: Load balancer does not have available server for client: engine-service
		// o/p : Load balancer does not have available server for client: engine-service
		// @formatter:off
		int loadBalancerIndex = errCauseStr.indexOf("Load balancer");
		if (loadBalancerIndex != -1)
			return errCauseStr;

		// @formatter:off
		// org.hibernate.QueryException: could not resolve property: refDocNo of: ...
		// o/p : could not resolve property: refDocNo
		// @formatter:off
		int hibernateQueryIndex = errCauseStr.indexOf("could not resolve property");
		if (hibernateQueryIndex != -1) {
			return errCauseStr.substring(hibernateQueryIndex, errCauseStr.indexOf(" of"));
		}

		return errCauseStr;
	}

	/**
	 * It returns high level message For e.g.,
	 * 
	 * could not execute query -> could not execute query</br>
	 * could not insert: [com.bugtracking.model.Operatingsystem] -> could not insert
	 * 
	 * @param str
	 * @return
	 */
	public static String getSQLGrammarMssg(String str) {
		String sqlMinInfoSeparator = "(.*?)(:|;|\\[|\"|\\.| at|\n|\r)(.*)";
		Pattern pattern = Pattern.compile(sqlMinInfoSeparator);
		Matcher matcher = pattern.matcher(str);
		String finalStr = str;
		if (matcher.find())
			finalStr = matcher.group(1).trim();
		return finalStr;
	}

}
