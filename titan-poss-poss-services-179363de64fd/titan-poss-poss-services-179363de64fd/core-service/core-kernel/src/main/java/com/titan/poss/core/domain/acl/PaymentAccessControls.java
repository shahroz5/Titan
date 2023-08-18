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

public final class PaymentAccessControls {

	private PaymentAccessControls() {
		throw new IllegalArgumentException("PaymentAccessControls class");
	}

	public static final String TRANSACTION_TYPE_ADD_EDIT = "M47";
	public static final String TRANSACTION_TYPE_VIEW = "M48";

	public static final String PAYMENT_CODE_ADD_EDIT = "M99";
	public static final String PAYMENT_CODE_VIEW = "M100";

	public static final String PAYEE_BANK_ADD_EDIT = "M101";
	public static final String PAYEE_BANK_VIEW = "M102";

	public static final String GL_BOUTIQUE_ADD_EDIT = "M105";
	public static final String GL_BOUTIQUE_VIEW = "M106";

	public static final String GL_BOUTIQUE_PAYMENT_MAPPING_ADD_EDIT = "M107";
	public static final String GL_BOUTIQUE_PAYMENT_MAPPING_VIEW = "M108";

	public static final String PAYER_BANK_ADD_EDIT = "M109";
	public static final String PAYER_BANK_VIEW = "M110";

	public static final String PAYMENT_CATEGORY_ADD_EDIT = "M129";
	public static final String PAYMENT_CATEGORY_VIEW = "M130";

	public static final String GIFT_CARD_TYPE_ADD_EDIT = "M117";
	public static final String GIFT_CARD_TYPE_VIEW = "M118";

	public static final String CUSTOMER_TYPE_ADD_EDIT = "M119";
	public static final String CUSTOMER_TYPE_VIEW = "M120";

	public static final String SALUTATION_ADD_EDIT = "M121";
	public static final String SALUTATION_VIEW = "M122";

	public static final String OCCASSION_TYPE_ADD_EDIT = "M123";
	public static final String OCCASSION_TYPE_VIEW = "M124";

	public static final String OTHER_CHARGES_REASONS_ADD_EDIT = "M125";
	public static final String OTHER_CHARGES_REASONS_VIEW = "M126";

	public static final String ID_PROOF_ADD_EDIT = "M127";
	public static final String ID_PROOF_VIEW = "M128";

	public static final String GRN_REASON_TYPE_ADD_EDIT = "M133";
	public static final String GRN_REASON_TYPE_VIEW = "M134";

	public static final String PAYMENT_GROUP_ADD_EDIT = "M129";
	public static final String PAYMENT_GROUP_VIEW = "M130";

	public static final String GIFT_VOUCHER_ADD_EDIT = "M103";
	public static final String GIFT_VOUCHER_VIEW = "M104";

	//airpay, unipay, razorpay hostname configuration.
	public static final String PAYMENT_HOSTNAME_ADD_EDIT = "C14";
	public static final String PAYMENT_HOSTNAME_VIEW = "C15";

	public static final String CREDIT_NOTE_VIEW = "M87";
	public static final String CREDIT_NOTE_ADD_EDIT = "M86";
	
	public static final String RELATION_TYPE_ADD_EDIT = "M144";
	public static final String RELATION_TYPE_UPDATE = "M145";
	public static final String RELATION_TYPE_VIEW = "M143";
	
	public static final String TRANSACTION_TYPE_MASTER_ADD_EDIT = "M147";
	public static final String TRANSACTION_TYPE_MASTER_VIEW = "M148";
	
}
