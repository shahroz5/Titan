/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.constants;

/**
 * Gift card type enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum GiftCardTypeEnum {

	PHYSICAL_CARD("PHYSICAL CARD"), EVOUCHER_CARD("EVOUCHER CARD");

	private String value;

	public String getValue() {
		return this.value;
	}

	GiftCardTypeEnum(String value) {
		this.value = value;
	}

	public static String valueOfEnum(String key) {
		for (GiftCardTypeEnum giftCardType : GiftCardTypeEnum.values()) {
			if (giftCardType.name().equals(key)) {
				return giftCardType.getValue();
			}
		}
		return "";
	}
}
