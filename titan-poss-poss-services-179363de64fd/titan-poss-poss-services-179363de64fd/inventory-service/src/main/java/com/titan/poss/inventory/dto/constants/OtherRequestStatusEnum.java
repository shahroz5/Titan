/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * Status enum class for other request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum OtherRequestStatusEnum {

	APVL_PENDING, APPROVED, APVL_REJECTED, ISSUED, CANCELLED, EXPIRED, SELECTED, OPEN;

	public static List<String> confirmList() {
		ArrayList<String> confirmStatusList = new ArrayList<>();
		confirmStatusList.add(APVL_PENDING.toString());
		confirmStatusList.add(CANCELLED.toString());
		return confirmStatusList;

	}

}
