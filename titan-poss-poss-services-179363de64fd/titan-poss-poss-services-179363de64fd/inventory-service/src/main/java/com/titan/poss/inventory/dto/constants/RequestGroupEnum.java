/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * Enum class for stock request group
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum RequestGroupEnum {

	SENT(Names.SENT), RECEIVED(Names.RECEIVED);

	public class Names {

		public static final String SENT = "SENT";
		public static final String RECEIVED = "RECEIVED";





		private Names() {
			throw new IllegalStateException("RequestGroupEnum.Names Class");
		}

	}

	private final String label;





	private RequestGroupEnum(String label) {
		this.label = label;
	}





	@Override
	public String toString() {
		return this.label;
	}





	public static String getEnumValues() {
		List<String> enumvalues = new ArrayList<>();
		enumvalues.add(RequestGroupEnum.RECEIVED.toString());
		enumvalues.add(RequestGroupEnum.SENT.toString());
		return enumvalues.toString();
	}

}
