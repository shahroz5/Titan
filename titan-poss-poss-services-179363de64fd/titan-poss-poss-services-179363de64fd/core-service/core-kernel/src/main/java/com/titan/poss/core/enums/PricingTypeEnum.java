/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.enums;

import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public enum PricingTypeEnum {

	UCP, NONUCP;

	public static List<String> getAllValues() {
		return List.of(UCP.name(), NONUCP.name());

	}
}
