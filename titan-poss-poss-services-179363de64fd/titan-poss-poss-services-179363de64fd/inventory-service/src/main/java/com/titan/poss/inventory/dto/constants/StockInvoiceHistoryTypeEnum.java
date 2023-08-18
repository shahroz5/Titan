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
public enum StockInvoiceHistoryTypeEnum {

	BTQ_CFA, CFA_BTQ, GEP, TEP_PLAIN, TEP_STUDDED,TEP_GOLD_COIN,DEFECTIVE;

	public static List<String> getPurchaseInvoiceType() {
		List<String> str = new ArrayList<>();
		str.add(StockInvoiceHistoryTypeEnum.BTQ_CFA.toString());
		str.add(StockInvoiceHistoryTypeEnum.GEP.toString());
		str.add(StockInvoiceHistoryTypeEnum.TEP_PLAIN.toString());
		str.add(StockInvoiceHistoryTypeEnum.TEP_STUDDED.toString());
		str.add(StockInvoiceHistoryTypeEnum.TEP_GOLD_COIN.toString());
		str.add(StockInvoiceHistoryTypeEnum.DEFECTIVE.toString());
		return str;
	}
}
