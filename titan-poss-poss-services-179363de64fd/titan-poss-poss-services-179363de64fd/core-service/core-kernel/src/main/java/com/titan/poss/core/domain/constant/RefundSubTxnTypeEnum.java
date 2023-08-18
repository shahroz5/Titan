/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum RefundSubTxnTypeEnum {

	NEW_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP,MANUAL_INTER_BRAND_TEP,MANUAL_FULL_VALUE_TEP,MANUAL_TEP;

	public static List<String> getAllRefundSubTxnType() {
		List<String> strList = new ArrayList<>();
		strList.add(RefundSubTxnTypeEnum.NEW_TEP.toString());
		strList.add(RefundSubTxnTypeEnum.INTER_BRAND_TEP.toString());
		strList.add(RefundSubTxnTypeEnum.FULL_VALUE_TEP.toString());
		strList.add(RefundSubTxnTypeEnum.MANUAL_TEP.toString());
		strList.add(RefundSubTxnTypeEnum.MANUAL_FULL_VALUE_TEP.toString());
		strList.add(RefundSubTxnTypeEnum.MANUAL_INTER_BRAND_TEP.toString());
		return strList;
	}
}
