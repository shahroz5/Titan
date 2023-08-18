/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.acl;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public final class InventoryAccessControls {

	public static final String RECEIVE_FROM_FACTORY = "I0";
	public static final String RECEIVE_INVOICE_FROM_CFA = "I1";
	public static final String RECEIVE_FROM_OTHER_BOUTIQUE = "I2";
	public static final String BIN_TO_BIN_TRANSFER = "I3";
	public static final String REQUEST_IBT_REQUESTS_SENT = "I4";
	public static final String REQUEST_IBT_REQUESTS_RECEIVED = "I5";
	public static final String CONVERSION_SEARCH_BY_VARIANT = "I6";
	public static final String CONVERSION_REQUESTS_SENT = "I7";
	public static final String OTHER_RECEIPTS_ADJUSTMENTS = "I8";
	public static final String OTHER_RECEIPTS_LOAN = "I9";
	public static final String OTHER_RECEIPTS_EXHIBITION = "I10";
	public static final String OTHER_RECEIPTS_PSV = "I11";
	public static final String OTHER_ISSUES_ADJUSTMENTS = "I12";
	public static final String OTHER_ISSUES_LOAN = "I13";
	public static final String OTHER_ISSUES_LOSS = "I14";
	public static final String OTHER_ISSUES_EXHIBITION = "I15";
	public static final String OTHER_ISSUES_PSV = "I16";
	public static final String REQUEST_FOR_BIN_CREATION = "I17";
	public static final String ISSUE_TO_FACTORY_FACTORY_INITIATED_REQUEST = "I18";
	public static final String ISSUE_TO_BOUTIQUE = "I20";
	public static final String MERCHENDIZING_INITIATED_STOCK_ISSUE = "I21";
	public static final String TEP_FOR_PLAIN = "I22";
	public static final String TEP_FOR_STUDDED = "I23";
	public static final String GEP = "I24";
	public static final String TEP_FOR_GOLD_COIN = "I25";
	public static final String OTHER_ISSUES_FOC = "I26";
	public static final String RECEIVE_FROM_MERCHENDIZE = "I27";
	public static final String CONFIRM_CONVERSION = "I34";
	public static final String VIEW_BIN = "I70";
	public static final String COIN = "I23";
	public static final String BTQ_CFA = "I22";
	public static final String DEFECTIVE = "I28";
	public static final String DIRECT_TRANSFER = "I73";


	// Approval related
	public static final String APPROVE_IBT_REQUESTS = "A3";
	public static final String APPROVE_NEW_BIN_REQUESTS = "A4";
	public static final String APPROVE_CONVERSION_REQUESTS = "A5";
	public static final String APPROVE_OTHER_ISSUES_PSV = "A7";
	public static final String APPROVE_OTHER_ISSUES_ADJUSTMENT = "A8";
	public static final String APPROVE_OTHER_ISSUES_LOAN = "A9";
	public static final String APPROVE_OTHER_ISSUES_EXHIBITION = "A10";
	public static final String APPROVE_OTHER_ISSUES_LOSS = "A11";
	public static final String APPROVE_OTHER_ISSUES_FOC = "A6";
	public static final String ISSUE_TO_CFA = "I39";

	// for history
	public static final String RECEIVE_FROM_FACTORY_HISTORY = "I42";
	public static final String RECEIVE_FROM_CFA_HISTORY = "I43";
	public static final String RECEIVE_FROM_OTHER_BOUTIQUE_HISTORY = "I44";
	public static final String RECEIVE_FROM_MERCHANDISE_HISTORY = "I45";
	public static final String BIN_TO_BIN_HISTORY = "I46";
	public static final String IBT_REQUEST_HISTORY = "I47";
	public static final String IBT_RECEIVE_REQUEST_HISTORY = "I48";
	public static final String CONVERSION_HISTORY = "I49";
	public static final String CONVERSION_SENT_REQUEST_HISTORY = "I50";
	public static final String OTHER_RECEIPT_ADJUSTMENTS_HISTORY = "I51";
	public static final String OTHER_RECEIPT_LOAN_HISTORY = "I52";
	public static final String OTHER_RECEIPT_EXHIBITION_HISTORY = "I53";
	public static final String OTHER_RECEIPT_PSV_HISTORY = "I54";
	public static final String OTHER_ISSUE_ADJUSTMENTS_HISTORY = "I55";
	public static final String OTHER_ISSUE_LOAN_HISTORY = "I56";
	public static final String OTHER_ISSUE_LOSS_HISTORY = "I57";
	public static final String OTHER_ISSUE_EXHIBITION_HISTORY = "I58";
	public static final String OTHER_ISSUE_PSV_HISTORY = "I59";
	public static final String OTHER_ISSUE_FOC_HISTORY = "I60";
	public static final String BIN_CREATION_REQUEST_HISTORY = "I61";
	public static final String STOCK_ISSUE_FACTORY_HISTORY = "I62";
	public static final String STOCK_ISSUE_CFA_HISTORY = "I63";
	public static final String STOCK_ISSUE_OTHER_BOUTIQUE_HISTORY = "I64";
	public static final String TEP_PLAIN_HISTORY = "I66";
	public static final String TEP_STUDDED_HISTORY = "I67";
	public static final String GEP_HISTORY = "I68";
	public static final String TEP_GOLD_COIN_HISTORY = "I72";
	public static final String DEFECTIVE_HISTORY = "I70";
	public static final String ADJ_SENT_REQUEST_HISTORY = "I28";
	public static final String LOAN_SENT_REQUEST_HISTORY = "I29";
	public static final String LOSS_SENT_REQUEST_HISTORY = "I30";
	public static final String EXH_SENT_REQUEST_HISTORY = "I31";
	public static final String PSV_SENT_REQUEST_HISTORY = "I32";
	public static final String FOC_SENT_REQUEST_HISTORY = "I33";
	public static final String DIRECT_TRANSFER_HISTORY = "I74";

	private InventoryAccessControls() {
	}
}
