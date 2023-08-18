/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum StockTransactionHistoryStatusEnum {

	RECEIVED, ISSUED, COMPLETED, APPROVED, APVL_REJECTED, PUBLISHED;

	public static List<String> getAllStatus() {
		List<String> strList = new ArrayList<>();
		strList.add(StockTransactionHistoryStatusEnum.RECEIVED.toString());
		strList.add(StockTransactionHistoryStatusEnum.ISSUED.toString());
		strList.add(StockTransactionHistoryStatusEnum.COMPLETED.toString());
		strList.add(StockTransactionHistoryStatusEnum.APPROVED.toString());
		strList.add(StockTransactionHistoryStatusEnum.APVL_REJECTED.toString());
		strList.add(StockTransactionHistoryStatusEnum.PUBLISHED.toString());
		return strList;
	}

}
