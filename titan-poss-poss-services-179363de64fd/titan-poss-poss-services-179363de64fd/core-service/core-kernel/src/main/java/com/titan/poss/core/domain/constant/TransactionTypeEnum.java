/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.domain.constant;

import java.util.List;

/**
 * TransactionType type enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum TransactionTypeEnum {

	// data as per 'transaction_master' in payments DB.
	// 'GRF,GIFT_SALE' is used only for configuration check - (payment and customer type
	// configurations)
	CM, AB, ADV, GEP, CO, TEP, GRF, GRN,GIFT_SALE;

	public static List<String> allowedTxnForManualbill() {
		return List.of(AB.name(), CM.name(), CO.name(), GEP.name(), TEP.name(), GRF.name());
	}

	public static List<String> notAllowedTxnForPaymentAfterMigration() {
		return List.of(AB.name(), CO.name());
	}

}
