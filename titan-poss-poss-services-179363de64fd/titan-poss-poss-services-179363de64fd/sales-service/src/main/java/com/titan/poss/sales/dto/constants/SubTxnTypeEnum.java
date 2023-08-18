/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;

/**
 * Enum class for sub transaction type.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum SubTxnTypeEnum {
	NEW_CM, MANUAL_CM, FOC_CM, GIFT_SALE, CASH_MEMO, NEW_GEP, MANUAL_GEP, FROZEN_RATES, NON_FROZEN_RATES,
	MANUAL_FROZEN_RATES, NEW_AB, MANUAL_AB, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, MANUAL_INTER_BRAND_TEP,
	MANUAL_FULL_VALUE_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP, NEW_CO,MANUAL_CO;

	public static List<String> getGepList() {
		List<String> strList = new ArrayList<>();
		strList.add(SubTxnTypeEnum.NEW_GEP.toString());
		strList.add(SubTxnTypeEnum.MANUAL_GEP.toString());
		return strList;
	}

	public static List<String> getByTxnType(TransactionTypeEnum txnTypeEnum) {
		List<String> subTxnList = null;
		if (txnTypeEnum == TransactionTypeEnum.ADV) {
			subTxnList = List.of(NON_FROZEN_RATES.name(), FROZEN_RATES.name(), MANUAL_FROZEN_RATES.name());
		} else if (txnTypeEnum == TransactionTypeEnum.CM) {
			subTxnList = List.of(NEW_CM.name(), MANUAL_CM.name(), GIFT_SALE.name(), FOC_CM.name());
		} else if (txnTypeEnum == TransactionTypeEnum.AB) {
			subTxnList = List.of(NEW_AB.name(), MANUAL_AB.name());
		} else if (txnTypeEnum == TransactionTypeEnum.GEP) {
			subTxnList = List.of(NEW_GEP.name(), MANUAL_GEP.name());
		} else if (txnTypeEnum == TransactionTypeEnum.TEP) {
			subTxnList = List.of(NEW_TEP.name(), MANUAL_TEP.name(), INTER_BRAND_TEP.name(), FULL_VALUE_TEP.name(),
					CUT_PIECE_TEP.name(), MANUAL_FULL_VALUE_TEP.name(), MANUAL_INTER_BRAND_TEP.name());
		} else if (txnTypeEnum == TransactionTypeEnum.CO) {
			subTxnList = List.of(NEW_CO.name(),MANUAL_CO.name());
		}
		return subTxnList;
	}

	public static List<String> getManualSubTxnTypes() {
		List<String> strList = new ArrayList<>();
		strList.add(MANUAL_CM.name());
		strList.add(MANUAL_GEP.name());
		strList.add(MANUAL_AB.name());
		strList.add(MANUAL_FROZEN_RATES.name());
		strList.add(MANUAL_TEP.name());
		strList.add(MANUAL_FULL_VALUE_TEP.name());
		strList.add(MANUAL_INTER_BRAND_TEP.name());
		strList.add(MANUAL_CO.name());
		return strList;
	}

	public static List<String> allowedTxnTypeOfManualGoodsExchange() {
		List<String> strList = new ArrayList<>();
		strList.add(SubTxnTypeEnum.MANUAL_GEP.toString());
		strList.add(SubTxnTypeEnum.MANUAL_TEP.toString());
		strList.add(SubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString());
		strList.add(SubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString());
		return strList;
	}

	public static List<String> allowedTxnForManualbillRequestApproval() {
		return List.of(MANUAL_CM.name(), MANUAL_AB.name(), MANUAL_FROZEN_RATES.name(),MANUAL_CO.name());
	}
}
