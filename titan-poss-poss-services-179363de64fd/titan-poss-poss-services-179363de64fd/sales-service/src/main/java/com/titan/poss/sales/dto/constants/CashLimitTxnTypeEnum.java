/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

import java.util.HashMap;
import java.util.Map;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;

/**
 * ENUM for transaction types in cash limit check.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum CashLimitTxnTypeEnum {

	AB("Advance Booking"), CM("Cash Memo"), GHS("GHS"), CO("Customer Order"), ADV("Accept Advance"), GRF("GRF"),
	GIFT_CARD("Gift Card"), TEP("TEP") , CN_CANCEL("CN CANCEL");

	private String value;

	private CashLimitTxnTypeEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return this.value;
	}

	static final Map<String, CashLimitTxnTypeEnum> BY_TXN_TYPE = new HashMap<>();

	static {
		for (CashLimitTxnTypeEnum t : values()) {
			BY_TXN_TYPE.put(t.getValue(), t);
		}
	}

	public static CashLimitTxnTypeEnum valueOfTxnType(String txnType) {
		return BY_TXN_TYPE.get(txnType);
	}

	public static CashLimitTxnTypeEnum getCashLimitTxnTypeBasedOnTxnTypeAndSubTxnType(String txnType,
			String subTxnType) {

		if ((SubTxnTypeEnum.FROZEN_RATES.name().equals(subTxnType)
				|| SubTxnTypeEnum.MANUAL_FROZEN_RATES.name().equals(subTxnType))
				&& TransactionTypeEnum.ADV.name().equals(txnType)) {
			return CashLimitTxnTypeEnum.GRF;

		} else if (SubTxnTypeEnum.GIFT_SALE.name().equals(subTxnType)
				&& TransactionTypeEnum.CM.name().equals(txnType)) {
			return CashLimitTxnTypeEnum.GIFT_CARD;

		} else if (TransactionTypeEnum.CM.name().equals(txnType)) {
			return CashLimitTxnTypeEnum.CM;

		} else if (TransactionTypeEnum.AB.name().equals(txnType)) {
			return CashLimitTxnTypeEnum.AB;

		} else if (TransactionTypeEnum.CO.name().equals(txnType)) {
			return CashLimitTxnTypeEnum.CO;

		} else if (TransactionTypeEnum.ADV.name().equals(txnType)) {
			return CashLimitTxnTypeEnum.ADV;

		} else if (TransactionTypeEnum.TEP.name().equals(txnType)) {
			return CashLimitTxnTypeEnum.TEP;

		}

		return null;
	}

}
