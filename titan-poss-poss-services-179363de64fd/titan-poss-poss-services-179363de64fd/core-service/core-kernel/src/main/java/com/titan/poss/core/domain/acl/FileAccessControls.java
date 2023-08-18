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

public final class FileAccessControls {

	private FileAccessControls() {
		throw new IllegalArgumentException("FileAccessControls class");
	}

	public static final String AIRPAY_CONFIG_ADD_EDIT = "F0";
	public static final String CARD_DETAILS_ADD_EDIT = "F1";
	public static final String PAYER_BANK_ADD_EDIT = "F2";
	public static final String PAYMENT_HOSTNAME_MAPPING_ADD_EDIT = "F3";
	public static final String GV_STATUS_UPDATE_ADD_EDIT = "F4";
	public static final String GV_VALIDITY_EXTEND_ADD_EDIT = "F5";
	public static final String GEP_CONFIG_EXCLUDE_MAPPING_ADD_EDIT = "F6";
	public static final String TAX_CONFIG_ADD_EDIT = "F7";
	public static final String FIR_ADD_EDIT = "F9";
	public static final String MER_ADD_EDIT = "F10";
	public static final String PRODUCT_PRICE_MAPPING_ADD_EDIT = "F8";
	public static final String QCGC_CONFIG_ADD_EDIT = "F11";
	public static final String ITEM_GROUP_LEVEL_DISCOUNT_ADD_EDIT = "F12";
	public static final String BEST_DEAL_DISCOUNT_ADD_EDIT = "F13";
	public static final String DISCOUNT_EXCLUDE_ITEM_MAPPING = "F14";
	public static final String ORACLE_ADD_EDIT = "F15";
	public static final String PRICE_LOGIC_TEST_ADD_EDIT = "F16";
	public static final String RAZORPAY_CONFIG_ADD_EDIT = "F17";
	public static final String EMPLOYEE_LOAN_CONFIG_ADD_EDIT = "F18";
	public static final String COMPLEXITY_PRICE_GROUP_DETAILS_ADD_EDIT = "F19";

}
