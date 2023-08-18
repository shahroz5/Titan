/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum SubTxnTypeCancelEnum {

	GIFT_SALE, CASH_MEMO, GEP, TEP;

	public static List<String> getByTxnType(TxnTypeCancelEnum txnTypeCancelEnum) {
		List<String> subTxnList = null;
		if (txnTypeCancelEnum == TxnTypeCancelEnum.CMCAN) {
			subTxnList = List.of(GIFT_SALE.name(), CASH_MEMO.name());
		} else if (txnTypeCancelEnum == TxnTypeCancelEnum.GEPCAN) {
			subTxnList = List.of(GEP.name());
		} else if (txnTypeCancelEnum == TxnTypeCancelEnum.GRN) {
			subTxnList = List.of(CASH_MEMO.name());
		} else if (txnTypeCancelEnum == TxnTypeCancelEnum.TEPCAN) {
			subTxnList = List.of(TEP.name());
		}
		return subTxnList;

	}

	public static List<String> allowedForRaisingRequestByTxnType(TxnTypeCancelEnum txnTypeCancelEnum) {
		List<String> subTxnList = new ArrayList<>();
		if (txnTypeCancelEnum == TxnTypeCancelEnum.CMCAN) {
			subTxnList = List.of(CASH_MEMO.name());
		}
		return subTxnList;
	}
}
