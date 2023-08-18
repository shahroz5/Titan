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
public enum BinRequestHistoryEnum {

	APPROVED, APVL_REJECTED;

	public static List<String> getAllStatus() {
		List<String> statuses = new ArrayList<>();
		statuses.add(BinRequestHistoryEnum.APPROVED.toString());
		statuses.add(BinRequestHistoryEnum.APVL_REJECTED.toString());
		return statuses;
	}
}
