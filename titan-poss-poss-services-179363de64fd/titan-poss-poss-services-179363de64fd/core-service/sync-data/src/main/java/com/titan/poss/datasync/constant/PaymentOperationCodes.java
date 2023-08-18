/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PaymentOperationCodes {

	public static final String PAYMENT_LOV_ADD = "PAYMENT_LOV-ADD";
	public static final String PAYMENT_LOV_UPDATE = "PAYMENT_LOV-UPDATE";

	public static final String PAYER_BANK_ADD = "PAYER_BANK-ADD";
	public static final String PAYER_BANK_UPDATE = "PAYER_BANK-UPDATE";

	public static final String PAYEE_BANK_ADD = "PAYEE_BANK-ADD";
	public static final String PAYEE_BANK_UPDATE = "PAYEE_BANK-UPDATE";

	public static final String PAYEE_BANK_LOCATION = "PAYEE_BANK_LOCATION";

	public static final String PAYER_BANK_CONFIG_ADD = "PAYER_BANK_CONFIG-ADD";
	public static final String PAYER_BANK_CONFIG_UPDATE = "PAYER_BANK_CONFIG-UPDATE";
	public static final String PAYER_BANK_LOCATION = "PAYER_BANK_LOCATION";

	public static final String PAYMENT_ADD = "PAYMENT-ADD";
	public static final String PAYMENT_UPDATE = "PAYMENT-UPDATE";

	public static final String PAYMENT_CATEGORY_ADD = "PAYMENT_CATEGORY-ADD";
	public static final String PAYMENT_CATEGORY_UPDATE = "PAYMENT_CATEGORY-UPDATE";
	public static final String PAYMENT_CATEGORY_PRODUCT = "PAYMENT_CATEGORY_PRODUCT";

	public static final String CASHBACK_ADD = "CASHBACK-ADD";
	public static final String CASHBACK_UPDATE = "CASHBACK-UPDATE";
	public static final String CREDIT_NOTE_UPDATE = "CREDIT_NOTE_UPDATE";

	public static final String CASHBACK_PRODUCT = "CASHBACK_PRODUCT";
	public static final String CASHBACK_OFFER_DETAILS_UPDATE = "CASHBACK_OFFER_DETAILS-UPDATE";
	public static final String CASHBACK_CARD_DETAILS_ADD = "CASHBACK_CARD_DETAILS-ADD";
	public static final String CASHBACK_CARD_DETAILS_UPDATE = "CASHBACK_CARD_DETAILS-UPDATE";

	public static final String CASHBACK_CARD = "CASHBACK_CARD";

	public static final String PAYMENT_CONFIG_ADD = "PAYMENT_CONFIG-ADD";
	public static final String PAYMENT_CONFIG_UPDATE = "PAYMENT_CONFIG-UPDATE";
	public static final String PAYMENT_CONFIG_DETAILS_UPDATE = "PAYMENT_CONFIG_DETAILS-UPDATE";
	public static final String PAYMENT_CONFIG_LOCATION = "PAYMENT_CONFIG_LOCATION";
	public static final String PAYMENT_CUSTOMER_MAPPING = "PAYMENT_CUSTOMER_MAPPING";

	public static final String GIFT_ADD = "GIFT-ADD";

	public static final String PAYER_CONFIG_DETAILS_UPDATE = "PAYER_CONFIG_DETAILS_UPDATE";

	public static final String PAYMENT_HOSTNAME_MAPPING_ADD = "PAYMENT_HOSTNAME_MAPPING-ADD";

}
