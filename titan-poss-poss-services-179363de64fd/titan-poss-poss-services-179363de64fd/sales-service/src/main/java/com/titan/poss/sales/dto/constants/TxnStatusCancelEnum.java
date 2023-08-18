/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum TxnStatusCancelEnum {

	CONFIRMED, CANCELLED, PENDING, APPROVED, REJECTED;

	public static List<String> getByTxnType(TxnTypeCancelEnum txnTypeCancel) {
		List<String> subTxnList = null;
		if (txnTypeCancel == TxnTypeCancelEnum.CMCAN) {
			subTxnList = List.of(CONFIRMED.name(), CANCELLED.name(), PENDING.name(), APPROVED.name(), REJECTED.name());
		}
		return subTxnList;
	}

}
