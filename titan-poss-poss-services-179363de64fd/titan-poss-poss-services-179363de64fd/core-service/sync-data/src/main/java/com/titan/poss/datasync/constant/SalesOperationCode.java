package com.titan.poss.datasync.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SalesOperationCode {

	public static final String DEPOSITE_SUMMARY = "DEPOSITE_SUMMARY";
	public static final String CASHMEMO_CONFIRM = "CASHMEMO-CONFIRM";
	public static final String CASHMEMO_APPROVE = "CASHMEMO-APPROVAL_REQ";
	public static final String CASHMEMO_DELETE = "CASHMEMO-DELETE";
	public static final String CANCEL_CONFIRM = "CANCEL_CONFIRM";
	public static final String GEP_CONFIRM = "GEP_CONFIRM";
	public static final String GRF_UPDATE = "GRF_UPDATE";
	public static final String ADVANCE_CONFIRM = "ADVANCE_CONFIRM";
	public static final String ORDER_CONFIRM = "ORDER-CONFIRM";
	public static final String ORDER_APPROVAL_REQ = "ORDER-APPROVAL_REQ";
	public static final String ORDER_CANCEL_RQ = "ORDER-CANCEL_REQUEST";
	public static final String ORDER_ACTIVATE_RQ = "ORDER-ACTIVATE_REQUEST";
	public static final String ORDER_CANCEL = "ORDER-CANCEL";
	public static final String ORDER_ACTIVATE = "ORDER-ACTIVATE";
	public static final String ORDER_RATE_FREEZE = "ORDER-RATE_FREEZE";
	public static final String PRE_ORDER = "ORDER-PRE_ORDER";
	public static final String PIF_UPDATE = "PIF_SERIES_UPDATE";
	public static final String BANK_DEPOSIT = "BANK_DEPOSIT";
	public static final String CUSTOMER_REGULAR = "CUSTOMER-REGULAR";
	public static final String CUSTOMER_REVERSE = "CUSTOMER-REVERSE";
	public static final String CUSTOMER_INTERNATIONAL = "CUSTOMER-INTERNATIONAL";
	public static final String CUSTOMER_INSTITUTIONAL = "CUSTOMER-INSTITUTIONAL";
	public static final String CUSTOMER_UPDATE = "CUSTOMER-UPDATE";
	public static final String CUSTOMER_LOCATION = "CUSTOMER-LOCATION";
	public static final String CUSTOMER_ONETIME = "CUSTOMER-ONETIME";
	public static final String PENDING_FOC_CM = "PENDING_FOC_CM";
	public static final String BOD_BUSINESS_DAY = "BUSINESS_DAY-BOD";
	public static final String EOD_BUSINESS_DAY = "BUSINESS_DAY-EOD";
	public static final String CUSTOMER_VISIT = "CUSTOMER_VISIT";
	public static final String SALES_DOC = "SALES_DOC-";
	public static final String GRN_CONFIRM = "GRN_CONFIRM";
	public static final String GRN_CONFIRM_REQ = GRN_CONFIRM + "-REQUEST";
	public static final String ACCOUNT_DETAILS = "ACCOUNT_DETAILS";
	public static final String GRF_MERGE = "GRF_MERGE";
	public static final String CREDIT_NOTE_IBT = "CREDIT_NOTE-IBT";
	public static final String CREDIT_NOTE_EGHS = "CREDIT_NOTE-EGHS";
	public static final String CREDIT_NOTE_EPOSS_SRC = "CN_EPOSS-SRC";
	public static final String CREDIT_NOTE_EPOSS_DEST = "CN_EPOSS-DEST";
	public static final String CREDIT_NOTE_EPOSS_OTHER = "CN_EPOSS-OTHER";
	public static final String CREDIT_NOTE_REVERSE = "CN_REVERSE";
	public static final String TEP_CONFIRM = "TEP_CONFIRM";
	public static final String CUSTOMER_DOCUMENT_CUS = "CUSTOMER_DOCUMENT-CUSTOMER";
	public static final String JOB_ORDER_SUSPEND = "JOB-ORDER_SUSPEND";
	public static final String JOB_CUST_DOCUMENT = "JOB-CUST_DOCUMENT";
	public static final String CN_WORKFLOW = "CN_WORKFLOW";
	public static final String SALES_DISCOUNT = "SALES_DISCOUNT";
	public static final String SALES_ORDER_CONFIG = "SALES_ORDER_CONFIG";
	public static final String CUSTOMER_PAYMENT_DETAILS="CUSTOMER_PAYMENT_DETAILS";
	public static final String PAYMENT_REQUEST = "PAYMENT_REQUEST";
	public static final String CUSTOMER_TCS_DETAILS = "CUSTOMER_TCS_DETAILS";
	public static final String DOC_NUMBER_FAIL_AUDIT= "DOC_NUMBER_FAIL_AUDIT";
	public static final String SALES_INVOICE_DOCUMENTS="SALES_INVOICE_DOCUMENTS";
}
