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

public class NotificationConstants {

	private NotificationConstants() {
		throw new IllegalArgumentException("NotificationConstants class");
	}

	public static final String REQ_ACTION_RO_PAYMENT = "N0";
	public static final String READY_TO_DOWNLOAD_REPORT = "N1";
	public static final String REQ_ACTION_CM_MANUAL_BILL = "N2";
	public static final String REQ_ACTION_AB_MANUAL_BILL = "N3";
	public static final String REQ_ACTION_AB_ACTIVATION = "N4";
	public static final String REQ_ACTION_AB_CANCELLATION = "N5";
	public static final String REQ_ACTION_GRN = "N6";
	public static final String ACTIVATION_MANUAL_FOC = "N7";
	public static final String REQ_ACTION_ROLE_INCREASE = "N8";
	public static final String ASSIGNED_TEMP_ROLE = "N9";
	public static final String REQ_SENT_ROLE_INCREASE = "N10";
	public static final String REMINDER_PSWD_EXPIRY = "N11";
	public static final String REQ_SENT_RO_PAYMENT = "N12";
	public static final String UPLOADED_GV_FILE = "N13";
	public static final String DONE_EOD_BOD = "N14";
	public static final String UPLOADED_GST_MAPPING_FILE = "N15";

}
