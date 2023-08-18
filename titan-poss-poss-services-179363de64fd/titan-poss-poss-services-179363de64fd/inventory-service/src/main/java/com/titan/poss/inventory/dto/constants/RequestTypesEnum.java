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
public enum RequestTypesEnum {

	BTQ, FAC, MER, LOAN, EXH, FOC, LOSS, ADJ, CONV, PSV;

	public static List<String> withBinGoupRequests() {

		List<String> requests = new ArrayList<>();

		requests.add(LOAN.toString());
		requests.add(LOSS.toString());
		requests.add(EXH.toString());

		return requests;
	}
}
