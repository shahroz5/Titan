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

public final class SalesAccessControls {

	private SalesAccessControls() {
		throw new IllegalArgumentException("SalesAccessControls class");
	}

	public static final String CUSTOMER_ADD_EDIT = "S0";
	public static final String CUSTOMER_VIEW = "S1";

	public static final String CASH_MEMO_ADD_EDIT = "S2";
	public static final String CASH_MEMO_VIEW = "S3";
	public static final String CASH_MEMO_HOLD = "S6";
	public static final String CASH_MEMO_CONFIRM = "S7";
	public static final String CASH_MEMO_PRINT = "S8";
	public static final String CASH_MEMO_HISTORY = "S12";
	public static final String CASH_MEMO_DELETE = "S87";
	public static final String CONVERT_AB_TO_CM = "S10";
	public static final String CASH_MEMO_PAYMENT_ADD_EDIT = "S4";
	public static final String CASH_MEMO_PAYMENT_VIEW = "S5";
	public static final String MANUAL_CASH_MEMO_ADD_EDIT = "S9";

	public static final String GIFT_CARD_SALE = "S13";
	public static final String GIFT_CARD_CANCEL = "S14";
	public static final String GIFT_CARD_DELETE = "S15";
	public static final String GIFT_CARD_HISTORY = "S16";

	public static final String PIF_SERIES_ADD_EDIT = "B3";
	public static final String PIF_SERIES_VIEW = "B4";

	public static final String WALK_INS_DETAILS_ADD_EDIT = "B5";
	public static final String WALK_INS_DETAILS_VIEW = "B6";

	public static final String BANK_DEPOSITE_ADD_EDIT = "B7";
	public static final String BANK_DEPOSITE_VIEW = "B8";
	public static final String BOD = "B9";
	public static final String EOD = "B10";
	public static final String TODAYS_REVENUE_VIEW = "B1";
	public static final String DAY_WISE_REVENUE_VIEW = "B2";

	public static final String GEP_ADD_EDIT = "S27";
	public static final String GEP_CONFIRM = "S28";
	public static final String GEP_VIEW = "S29";
	public static final String MANUAL_GEP_ADD_EDIT = "S30";
	public static final String MANUAL_GEP_CONFIRM = "S31";
	public static final String MANUAL_GEP_VIEW = "S32";
	public static final String GEP_CANCEL = "S33";
	public static final String TEP_ADD_EDIT = "S34";
	public static final String TEP_CONFIRM = "S35";
	public static final String TEP_VIEW = "S36";
	public static final String TEP_CANCEL = "S40";
	public static final String MANUAL_TEP_ADD_EDIT = "S37";
	public static final String MANUAL_TEP_CONFIRM = "S38";
	public static final String MANUAL_TEP_VIEW = "S39";

	public static final String ADVANCE_BOOKING_ADD_EDIT = "S41";
	public static final String ADVANCE_BOOKING_VIEW = "S42";
	public static final String ADVANCE_BOOKING_HOLD = "S45";
	public static final String ADVANCE_BOOKING_CONFIRM = "S46";// duplicate
	public static final String ADVANCE_BOOKING_PRINT = "S47";
	public static final String MANUAL_AB_ADD_EDIT = "S48";
	public static final String ADVANCE_BOOKING_CANCELLATION_REQUEST_VIEW = "S49";
	public static final String ADVANCE_BOOKING_CANCELLATION_CONFIRM = "S50";
	public static final String ADVANCE_BOOKING_ACTIVATION_REQUEST_VIEW = "S51";
	public static final String ADVANCE_BOOKING_ACTIVATION_CONFIRM = "S52";
	public static final String ADVANCE_BOOKING_RATE_FREEZE = "S46";
	public static final String ADVANCE_BOOKING_DELETE = "S46";
	public static final String ADVANCE_BOOKING_PAYMENT_ADD_EDIT = "S43";
	public static final String ADVANCE_BOOKING_PAYMENT_VIEW = "S44";

	public static final String CUSTOMER_ORDER_ADD_EDIT = "S53";
	public static final String CUSTOMER_ORDER_VIEW = "S54";
	public static final String CUSTOMER_ORDER_HOLD = "S57";
	public static final String CUSTOMER_ORDER_CONFIRM = "S58";
	public static final String CUSTOMER_ORDER_PRINT = "S59";
	public static final String CUSTOMER_ORDER_PAYMENT_ADD_EDIT = "S55";
	public static final String CUSTOMER_ORDER_PAYMENT_VIEW = "S56";
	public static final String CUSTOMER_ORDER_DELETE = "S99";
	public static final String MANUAL_CO_ADD_EDIT = "S100";
	public static final String CUSTOMER_ORDER_CANCELLATION_REQUEST_VIEW = "S101";
	public static final String CUSTOMER_ORDER_CANCELLATION_CONFIRM = "S102";
	public static final String CUSTOMER_ORDER_ACTIVATION_REQUEST_VIEW = "S103";
	public static final String CUSTOMER_ORDER_ACTIVATION_CONFIRM = "S104";
	public static final String CUSTOMER_ORDER_RATE_FREEZE = "S105";

	public static final String CREDIT_NOTE_CANCEL_REQUEST = "S61";
	public static final String CREDIT_NOTE_CANCEL_CONFIRM = "S62";
	//pending
	public static final String CREDIT_NOTE_ADD_EDIT = "S108";

	public static final String CREDIT_NOTE_VIEW = "S63";
	public static final String CREDIT_NOTE_GHS_TRANSFER = "S64";
	public static final String CREDIT_NOTE_DOWNLOAD = "S65";
	public static final String CREDIT_NOTE_IBT_REQUEST = "S66";
	public static final String CREDIT_NOTE_IBT_APPROVE = "S67";
	public static final String CREDIT_NOTE_IBT_TRANSFER = "S68";
	public static final String CREDIT_NOTE_ACTIVATION_REQUEST = "S69";
	public static final String CREDIT_NOTE_ACTIVATION_CONFIRM = "S70";
	public static final String CREDIT_NOTE_GOLD_RATE_REMOVAL_REQUEST = "S71";
	public static final String CREDIT_NOTE_GOLD_RATE_REMOVAL_CONFIRM = "S72";

	public static final String BILL_CANCELLATION_CONFIRM = "S73";
	public static final String BILL_CANCELLATION_REQUEST_VIEW = "S74";

	public static final String GRN_VIEW = "S75";
	public static final String GRN_CONFIRM = "S76";
	public static final String GRN_REQUEST = "S77";
	public static final String GRN_HISTORY = "S78";

	public static final String ACCEPT_ADVANCE_ADD_EDIT = "S79";
	public static final String ACCEPT_ADVANCE_VIEW = "S80";
	public static final String ACCEPT_ADVANCE_CONFIRM = "S81";
	public static final String ACCEPT_ADVANCE_DELETE = "S82";

	public static final String GRF_ADD_EDIT = "S83";
	public static final String GRF_VIEW = "S84";
	public static final String GRF_CONFIRM = "S85";
	public static final String GRF_DELETE = "S86";
	public static final String GRF_MERGE = "S93";

	public static final String CASHIER_SIGNATURE_ADD_EDIT = "S96";
	public static final String CASHIER_SIGNATURE_VIEW = "S97";

	public static final String UPDATE_EINVOICE = "S98";

	public static final String CUSTOMER_SIGNATURE_ADD_EDIT = "S94";
	public static final String CUSTOMER_SIGNATURE_VIEW = "S95";
	
	public static final String ORDER_ADD_EDIT_PERMISSION="S106";
	public static final String CASH_MEMO_ADD_EDIT_PERMISSION="S107";

}
