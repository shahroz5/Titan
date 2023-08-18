/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.constants;

import java.util.HashMap;
import java.util.Map;

/**
 * ENUM class for Sales service Discount Descriptions
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum DiscountDescriptionEnum {

	SYSTEM_DISCOUNT_GHS_BONUS("GHS DISCOUNT"), KARAT_EXCHANGE_OFFER_DISCOUNT("KARAT EXCHANGE OFFER DISCOUNT"),
	DIGI_GOLD_DISCOUNT("DIGI GOILD DISCOUNT"), CATEGORY_DISCOUNT("CATEGORY DISCOUNT"), SYSTEM_DISCOUNT_DV("DV DISCOUNT"), 
	ITEM_GROUP_LEVEL_DISCOUNT("PRODUCT LEVEL DISCOUNT"), BILL_LEVEL_DISCOUNT("BILL LEVEL DISCOUNT"), 
	COIN_OFFER_DISCOUNT("COIN OFFER DISCOUNT"), GRN_MULTIPLE_DISCOUNT("GRN MULTIPLE DISCOUNT"), 
	RIVAAH_CARD_DISCOUNT("RIVAAH CARD DISCOUNT"), SYSTEM_DISCOUNT_GEP_PURITY("GEP PURITY DISCOUNT");

	String discountDescription;

	DiscountDescriptionEnum(String discountDescription) {
		this.discountDescription = discountDescription;
	}

	public String getDiscountDescription() {
		return this.discountDescription;
	}

	static final Map<DiscountDescriptionEnum, String> DISCOUNT_DESCRIPTION = new HashMap<>();

	static {
		for (DiscountDescriptionEnum d : DiscountDescriptionEnum.values()) {
			DISCOUNT_DESCRIPTION.put(d, d.getDiscountDescription().toUpperCase());
		}
	}

	public static String valueOfDiscountDesc(String discountDesc) {

		for (DiscountDescriptionEnum discount : DiscountDescriptionEnum.values()) {
			if (discount.name().equals(discountDesc)) {
				return discount.getDiscountDescription();
			}
		}
		return "ITEM_GROUP_LEVEL_DISCOUNT";
	}

}
