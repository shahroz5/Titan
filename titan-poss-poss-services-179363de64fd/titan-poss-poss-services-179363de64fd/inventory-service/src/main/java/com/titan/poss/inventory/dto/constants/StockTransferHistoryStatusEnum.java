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
public enum StockTransferHistoryStatusEnum {

	ISSUED, RECEIVED, CANCELLED, PUBLISHED;

	public static List<String> getAllStatus() {
		List<String> strList = new ArrayList<>();
		strList.add(StockTransferHistoryStatusEnum.ISSUED.toString());
		strList.add(StockTransferHistoryStatusEnum.RECEIVED.toString());
		strList.add(StockTransferHistoryStatusEnum.CANCELLED.toString());
		strList.add(StockTransferHistoryStatusEnum.PUBLISHED.toString());
		return strList;
	}
}
