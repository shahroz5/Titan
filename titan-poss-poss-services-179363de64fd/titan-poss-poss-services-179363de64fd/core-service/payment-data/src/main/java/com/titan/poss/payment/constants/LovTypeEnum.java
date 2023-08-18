/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.constants;

/**
 * Lov type enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum LovTypeEnum {

	PAYMENT_GROUP("Payment Group"), CUSTOMER_TYPE("Customer Type"), OCCASION_TYPE("Occasion Type"),
	OTHER_CHARGES_REASONS("Other Charges Reason"), SALUTATION("Salutation"), GIFT_CARD_TYPE("Gift Card Type"),
	ID_PROOF("Id Proof"), GRN_REASON_TYPE("GRN Reason Type"), FULL_VALUE_TEP_REASON("Full Value TEP Reason"),
	TATA_COMPANY("Tata Company"), REFUND_PAYMENT_MODE("Refund Paymet Mode"), INVOICE_TYPE("Invoice Type"),
	REASON_FOR_CANCELLATION("Reason for Cancellation"),
	REASON_FOR_NOT_GIVING_DISCOUNT("Reason for not giving discounts"),RELATIONSHIP_TYPE("Relationship Type"),
	REASON_FOR_CHANGING_DISCOUNT("Reason for changing discounts");

	String lovName;

	LovTypeEnum(String lovName) {
		this.lovName = lovName;
	}

	public String getLovName() {
		return lovName;
	}

}
