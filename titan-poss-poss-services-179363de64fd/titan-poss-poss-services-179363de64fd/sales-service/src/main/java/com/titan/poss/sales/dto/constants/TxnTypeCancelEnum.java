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

public enum TxnTypeCancelEnum {

	CNCAN, GEPCAN, TEPCAN, CMCAN, GRN;

	public static List<String> getCancelTypes() {
		List<String> strList = new ArrayList<>();
		strList.add(TxnTypeCancelEnum.CMCAN.toString());
		strList.add(TxnTypeCancelEnum.GEPCAN.toString());
		strList.add(TxnTypeCancelEnum.TEPCAN.toString());
		return strList;
	}

	public static List<String> txnTypesAllowedtoRaiseRequest() {
		List<String> txnList = new ArrayList<>();
		txnList.add(TxnTypeCancelEnum.CMCAN.toString());
		return txnList;
	}
}
