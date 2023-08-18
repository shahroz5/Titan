/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.enums;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum TxnTaxTypeEnum {

	CUST_TRANSACTION_ADV_BOOKING("Customer Transaction_Advance Booking_New Advance Booking"),
	CUST_TRANSACTION_CM("Customer Transaction_Cash Memo_New CM"),
	CUST_TRANSACTION_PRIORITY_ORDER("Customer Transaction_Priority Order_New Priority Order"),
	INV_MANAGMNT_STOCK_ISSUE("Inventory Management_Stock Issue"),
	INV_MANAGMNT_STOCK_ISSUE_OTHER_ISSUE("Inventory Management_Stock Issue_Other Issues _Issue_Loss"),
	INV_MANAGMNT_STOCK_ISSUE_TEP_GEP("Inventory Management_Stock Issue_TEP/GEP"),
	INV_MANAGMNT_STOCK_RECEIPT_OTHER_RECEIPT("Inventory Management_Stock Receipt_Other Receipts _Accept_Loss"),
	SERVICE_PAYMENT("Service_Payment"), SERVICE_PROCESSING("Service_Processing"), TEP_GEP("TEP/GEP_GEP_New GEP"),
	TEP_GEP_TANISHQ_EXCHANGE("TEP/GEP_Tanishq Exchange_TEP");

	private static final Map<String, String> taxMap = new HashMap<>();
	static {
		taxMap.put(CUST_TRANSACTION_ADV_BOOKING.name(), CUST_TRANSACTION_ADV_BOOKING.getValue());
		taxMap.put(CUST_TRANSACTION_CM.name(), CUST_TRANSACTION_CM.getValue());
		taxMap.put(CUST_TRANSACTION_PRIORITY_ORDER.name(), CUST_TRANSACTION_PRIORITY_ORDER.getValue());
		taxMap.put(SERVICE_PAYMENT.name(), SERVICE_PAYMENT.getValue());
		taxMap.put(SERVICE_PROCESSING.name(), SERVICE_PROCESSING.getValue());
		taxMap.put(TEP_GEP.name(), TEP_GEP.getValue());
		taxMap.put(TEP_GEP_TANISHQ_EXCHANGE.name(), TEP_GEP_TANISHQ_EXCHANGE.getValue());
	}

	private String value;

	public String getValue() {
		return this.value;

	}

	TxnTaxTypeEnum(String value) {
		this.value = value;
	}

	public static boolean contains(String key) {
		return taxMap.containsKey(key);
	}

	public static String valueOfEnum(String key) {
		for (TxnTaxTypeEnum taxType : TxnTaxTypeEnum.values()) {
			if (taxType.name().equals(key)) {
				return taxType.getValue();
			}
		}
		return "";
	}

}
