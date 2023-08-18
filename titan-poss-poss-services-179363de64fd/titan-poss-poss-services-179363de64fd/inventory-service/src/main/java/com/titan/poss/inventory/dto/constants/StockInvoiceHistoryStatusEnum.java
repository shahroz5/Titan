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
public enum StockInvoiceHistoryStatusEnum {

	ISSUED, RECEIVED, PUBLISHED;

	public static List<String> getAllStatus() {
		List<String> strList = new ArrayList<>();
		strList.add(StockInvoiceHistoryStatusEnum.ISSUED.toString());
		strList.add(StockInvoiceHistoryStatusEnum.RECEIVED.toString());
		strList.add(StockInvoiceHistoryStatusEnum.PUBLISHED.toString());
		return strList;
	}

}
