/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public enum ReturnInvoiceType {
	BTQ_CFA, BTQ_CFA_GRN, TEP_PLAIN, TEP_STUDDED, GEP, COIN,TEP_GOLD_COIN;

	public static List<String> getEnumForCarrierDetails() {
		List<String> strList = new ArrayList<>();
		strList.add(TEP_PLAIN.toString());
		strList.add(TEP_STUDDED.toString());
		strList.add(GEP.toString());
		strList.add(COIN.toString());
		strList.add(TEP_GOLD_COIN.toString());
		return strList;
	}

}
