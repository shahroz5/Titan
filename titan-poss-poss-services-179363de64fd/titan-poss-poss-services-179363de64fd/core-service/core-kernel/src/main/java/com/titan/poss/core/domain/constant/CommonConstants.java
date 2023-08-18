/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class CommonConstants {

	private CommonConstants() {
		throw new IllegalArgumentException("CommonConstants class");
	}

//  BUSINESS
	public static final String TEP_BIN_CODE = "TEP";
	public static final String TEP_SALE_BIN_CODE = "TEPSALE";
	public static final String HALLMARK_DISPUTE_BIN = "HALLMARKDISPUTEBIN";
	public static final String STN= "STN";
	public static final String ZEROBIN= "ZEROBIN";
	public static final String HMGST = "HMGST";
	public static final String BIN_GROUP_RESERVE_BIN = "RESERVEBIN";
	public static final String FOC="FOC";
	public static final String LJ="LJ";
	public static final String JL="JL";
	public static final String CUSTOM_ORDER_BIN = "CUSTOMERORDERBIN";
	
//	TECHNICAL
	public static final String MESSAGE = "message";
	public static final String CODE = "code";
	public static final String DATA = "data";
	public static final String ERROR_CAUSE = "errorCause";
	public static final String FIELD_ERROR = "fieldErrors";
	public static final String DYNAMIC_VALUES = "dynamicValues";

	public static final String SYSTEM = "system";
	public static final String AUTH_HEADER = "Authorization";
	public static final String REF_TOKEN_HEADER = "ref_tok";
	public static final String PASS_WORD = "Password";
	public static final String COOKIE_HEADER = "Cookie";

//	DOMAIN
	public static final String WEIGHT_UNIT = "gms";
	public static final String CURRENCY_CODE = "INR";
	public static final String ORG_CODE = "TJEW";
	public static final Short PRINT_COUNT = 5;// to be removed & referred from location
	public static final String WEIGHT_DETAILS = "WEIGHT_DETAILS";

//  SCHEDULER
	public static final String SHEDLOCK_PT2M = "PT2M";
	public static final String SHEDLOCK_PT3M = "PT3M";
	public static final String SHEDLOCK_PT30S = "PT30S";

// OTHER
	public static final String ZERO = "0";

	public static final String EPOSS_API_WARNING = "<p style=\"color:red;font-size: 100%;\">This API needs to be run at EPOSS & will only be consumed by POSS API internally.</p>";
	public static final String USER_NAME = "username";
	public static final String PSWD = "password";
	public static final String TOKEN = "token";
}
