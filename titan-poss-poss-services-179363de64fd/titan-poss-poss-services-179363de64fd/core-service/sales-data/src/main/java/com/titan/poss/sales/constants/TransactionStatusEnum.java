/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.constants;

import java.util.List;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;

/**
 * Transaction status enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum TransactionStatusEnum {
	ALL,HOLD, CONFIRMED, OPEN, CANCELLATION_PENDING, CANCELLED, DELETED, APPROVAL_PENDING, EXPIRED, SUSPENDED,
	ACTIVATION_PENDING, CLOSED, REJECTED, RESIDUAL_CLOSURE, PARTIAL_INVOICE, DELIVERED, RELEASED, REVERSED;

	public static List<String> getByTxnType(TransactionTypeEnum txnTypeEnum) {

		List<String> subTxnList = null;

		// OPEN create docno, cancelled, if wants to close it or scheduler at EOD
		if (txnTypeEnum == TransactionTypeEnum.ADV)
			subTxnList = List.of(OPEN.name(), DELETED.name(), CONFIRMED.name());

		return subTxnList;
	}

	public static List<String> allowedInputStatus() {
		return List.of(HOLD.name(), CONFIRMED.name(), APPROVAL_PENDING.name());
	}

	public static List<String> closedStatusList() {
		return List.of(CANCELLED.name(), DELETED.name(), EXPIRED.name(), CLOSED.name());
	}
}
