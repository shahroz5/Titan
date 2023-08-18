/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.domain.acl;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class ConfigAccessControls {

	private ConfigAccessControls() {
		throw new IllegalArgumentException("ConfigAccessControls class");
	}

	public static final String IBT_RULETYPE_VIEW = "C1";
	public static final String IBT_RULETYPE_ADD_EDIT = "C0";

	public static final String WEIGHT_TOL_RULETYPE_ADD_EDIT = "C2";
	public static final String WEIGHT_TOL_RULETYPE_VIEW = "C3";

	public static final String CONVERSIONS_RULETYPE_ADD_EDIT = "C4";
	public static final String CONVERSIONS_RULETYPE_VIEW = "C5";

	public static final String INVOICE_RULETYPE_ADD_EDIT = "C6";
	public static final String INVOICE_RULETYPE_VIEW = "C7";

	public static final String HISTORY_TIME_RULETYPE_ADD_EDIT = "C8";
	public static final String HISTORY_TIME_RULETYPE_VIEW = "C9";

	public static final String AMENDMENT_RULETYPE_ADD_EDIT = "C129";
	public static final String AMENDMENT_RULETYPE_VIEW = "C130";

	public static final String CASH_PAYMENT_RULETYPE_ADD_EDIT = "C10";
	public static final String CASH_PAYMENT_RULETYPE_VIEW = "C11";

	//already created in paymentAcceessControllers
	public static final String PAYMENT_CONFIGURATIONS_ADD_EDIT = "C139";
	public static final String PAYMENT_CONFIGURATIONS_VIEW = "C140";

	public static final String GRF_TOLERANCE_ADD_EDIT = "C22";
	public static final String GRF_TOLERANCE_VIEW = "C23";

	public static final String GRN_TOLERANCE_ADD_EDIT = "C29";
	public static final String GRN_TOLERANCE_VIEW = "C28";

	public static final String AB_TOLERANCE_ADD_EDIT = "C31";
	public static final String AB_TOLERANCE_VIEW = "C30";

	public static final String AB_TOLERANCE_RESIDUAL_ADD_EDIT = "C77";
	public static final String AB_TOLERANCE_RESIDUAL_VIEW = "C76";

	public static final String CN_PRIORITY_CONFIG_ADD_EDIT = "C34";
	public static final String CN_PRIORITY_CONFIG_VIEW = "C35";

	public static final String CN_TEP_VALIDATION_CONFIG_ADD_EDIT = "C48";
	public static final String CN_TEP_VALIDATION_CONFIG_VIEW = "C49";

	public static final String CN_GRN_VALIDATION_CONFIG_ADD_EDIT = "C46";
	public static final String CN_GRN_VALIDATION_CONFIG_VIEW = "C47";

	public static final String CN_GHS_VALIDATION_CONFIG_ADD_EDIT = "C44";
	public static final String CN_GHS_VALIDATION_CONFIG_VIEW = "C45";

	public static final String CN_GEP_VALIDATION_CONFIG_ADD_EDIT = "C42";
	public static final String CN_GEP_VALIDATION_CONFIG_VIEW = "C43";

	public static final String CN_IB_CN_VALIDATION_CONFIG_ADD_EDIT = "C40";
	public static final String CN_IB_CN_VALIDATION_CONFIG_VIEW = "C41";

	public static final String CN_BC_VALIDATION_CONFIG_ADD_EDIT = "C38";
	public static final String CN_BC_VALIDATION_CONFIG_VIEW = "C39";

	public static final String CN_ADV_VALIDATION_CONFIG_ADD_EDIT = "C36";
	public static final String CN_ADV_VALIDATION_CONFIG_VIEW = "C37";

	public static final String ORDER_AB_PAYMENT_CONFIG_ADD_EDIT = "C79";
	public static final String ORDER_AB_PAYMENT_CONFIG_VIEW = "C78";

	public static final String GRN_INTER_OWNER_TYPE_ADD_EDIT = "C27";
	public static final String GRN_INTER_OWNER_TYPE_VIEW = "C26";

	public static final String GRN_APPROVAL_ACCESS_REGULAR_ADD_EDIT = "C24";
	public static final String GRN_APPROVAL_ACCESS_REGULAR_VIEW = "C25";

	public static final String GRN_APPROVAL_ACCESS_MFG_DEFECT_ADD_EDIT = "C20";
	public static final String GRN_APPROVAL_ACCESS_MFG_DEFECT_VIEW = "C21";

	public static final String BGR_TOLERANCE_CONFIG_ADD_EDIT = "C33";
	public static final String BGR_TOLERANCE_CONFIG_VIEW = "C32";

	public static final String BGR_CONFIG_ADD_EDIT = "C90";
	public static final String BGR_CONFIG_VIEW = "C89";

	public static final String CUSTOMER_CONFIGURATIONS_ADD_EDIT = "C16";
	public static final String CUSTOMER_CONFIGURATIONS_VIEW = "C17";

	public static final String CASH_BACK_ADD_EDIT = "C12";
	public static final String CASH_BACK_VIEW = "C13";

	public static final String DISCOUNT_ADD_EDIT = "C50";
	public static final String DISCOUNT_VIEW = "C51";

	public static final String FOC_SCHEME_ADD_EDIT = "C52";
	public static final String FOC_SCHEME_VIEW = "C53";

	public static final String GEP_PURITY_ADD_EDIT = "C54";
	public static final String GEP_PURITY_VIEW = "C55";

	public static final String TEP_CONFIGURATION_ADD_EDIT = "C56";
	public static final String TEP_CONFIGURATION_VIEW = "C57";

	public static final String TEP_EXCEPTION_ADD_EDIT = "C58";
	public static final String TEP_EXCEPTION_VIEW = "C59";

	public static final String TEP_GENERAL_CODES_ADD_EDIT = "C93";
	public static final String TEP_GENERAL_CODES_VIEW = "C94";

	public static final String TEP_VALIDATION_ADD_EDIT = "C60";
	public static final String TEP_VALIDATION_VIEW = "C61";

	public static final String CUT_PIECE_TEP_ADD_EDIT = "C62";
	public static final String CUT_PIECE_TEP_VIEW = "C63";

	public static final String TEP_PRODUCT_GROUP_ADD_EDIT = "C64";
	public static final String TEP_PRODUCT_GROUP_VIEW = "C65";

	public static final String TEP_STONE_ADD_EDIT = "C66";
	public static final String TEP_STONE_VIEW = "C67";

	public static final String PRINTER_CONFIGURATION_ADD_EDIT = "C69";
	public static final String PRINTER_CONFIGURATION_VIEW = "C68";

	public static final String BANK_PRIORITY_ADD_EDIT = "C71";
	public static final String BANK_PRIORITY_VIEW = "C70";

	public static final String PRODUCT_PRICING_MATERIAL_PRICE_ADD_EDIT = "C91";
	public static final String PRODUCT_PRICING_MATERIAL_PRICE_VIEW = "C92";

	public static final String TAX_STATE_TAX_VIEW = "C73";
	public static final String TAX_STATE_TAX_ADD_EDIT = "C72";
	public static final String TAX_TAX_CONFIG_ADD_EDIT = "C74";
	public static final String TAX_TAX_CONFIG_VIEW = "C75";

	public static final String LOCATION_MANUAL_BILL_PASS = "C86";
	public static final String LOCATION_METAL_RATE_PASS = "C87";
	public static final String LOCATION_BANK_DEPOSITE_PASS = "C88";

	public static final String WORKFLOW_REQEXPIRE_GLOBAL_CONFIG_VIEW = "C95";
	public static final String WORKFLOW_REQEXPIRE_GLOBAL_CONFIG_ADD_EDIT = "C96";

	public static final String FTEP_APPROVAL_ACCESS_REGULAR_ADD_EDIT = "C97";
	public static final String FTEP_APPROVAL_ACCESS_REGULAR_VIEW = "C98";

	public static final String RIVAAH_CARD_ELIGIBILITY_ADD_EDIT = "C100";
	public static final String RIVAAH_CARD_ELIGIBILITY_VIEW = "C99";

	public static final String DISCOUNT_RAISE_REQUEST = "C101";
	public static final String DISCOUNT_UPDATE_REQUEST = "C102";
	public static final String DISCOUNT_APPROVE_REQUEST = "C103";
	
	public static final String CO_TOLERANCE_VIEW = "C107";
	public static final String CO_TOLERANCE_ADD_EDIT = "C108";

	public static final String CO_TOLERANCE_RESIDUAL_VIEW = "C109";
	public static final String CO_TOLERANCE_RESIDUAL_ADD_EDIT = "C110";
	
	public static final String ORDER_CO_PAYMENT_CONFIG_VIEW = "C111";
	public static final String ORDER_CO_PAYMENT_CONFIG_ADD_EDIT = "C112";
	
	public static final String CN_MASTER_ADD_EDIT = "C113";
	public static final String CN_MASTER_VIEW = "C114";
	
	public static final String FOC_AT_CUST_TRANSACTION_ADD_EDIT = "C115";
	public static final String FOC_AT_CUST_TRANSACTION_VIEW = "C116";
	
	public static final String CUSTOMER_CONFIG_ADD_EDIT = "C117";
	public static final String CUSTOMER_CONFIG_VIEW = "C118";
	
	public static final String ENCIRCLE_REDEMPTION_ADD_EDIT = "C119";
	public static final String ENCIRCLE_REDEMPTION_VIEW = "C120";

	public static final String GST_MAPPING_ADD_EDIT = "C121";
	public static final String GST_MAPPING_VIEW = "C122";
	
	public static final String GV_STATUS_UPDATE_ADD_EDIT = "C123";
	public static final String GV_STATUS_UPDATE_VIEW = "C124";
	
	public static final String FOC_AT_LOC_TRANSACTION_ADD_EDIT = "C125";
	public static final String FOC_AT_LOC_TRANSACTION_VIEW = "C126";
	
	public static final String VENDOR_CONFIG_ADD_EDIT = "C127";
	public static final String VENDOR_CONFIG_VIEW = "C128";
		
	public static final String PAYER_BANK_CONFIG_ADD_EDIT = "C131";
	public static final String PAYER_BANK_CONFIG_VIEW = "C132";
	
	public static final String CREDIT_NOTE_DIRECT_ADD_EDIT = "C133";
	public static final String CREDIT_NOTE_DIRECT_VIEW = "C134";
	
	public static final String RANGE_CONFIGURATION_ADD_EDIT = "C135";
	public static final String RANGE_CONFIGURATION_VIEW = "C136";
	
	public static final String INVENTORY_GLOBAL_CONFIG_ADD_EDIT = "C137";
	public static final String INVENTORY_GLOBAL_CONFIG_VIEW = "C138";
	
	public static final String TEP_MAX_FLAT_TEP_ADD_EDIT = "C141";
	public static final String TEP_MAX_FLAT_TEP_VIEW = "C142";
	
	public static final String CLUBBING_OF_DISCOUNT_ADD_EDIT = "C143";
	public static final String CLUBBING_OF_DISCOUNT_VIEW = "C144";
	
	public static final String EMPLOYEE_LOAN_ADD_EDIT = "C145";
	public static final String EMPLOYEE_LOAN_VIEW = "C146";
}

