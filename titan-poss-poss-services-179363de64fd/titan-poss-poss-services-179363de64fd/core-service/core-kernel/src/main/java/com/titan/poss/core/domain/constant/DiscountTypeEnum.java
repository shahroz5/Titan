/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

import java.util.List;

import com.titan.poss.core.domain.constant.enums.UlpDiscountType;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum DiscountTypeEnum {

	// NOTE: add discount type with respective status in DiscountInitialStatusEnum
	// as well. To utilize discount in sales accordingly.

	CATEGORY_DISCOUNT, SLAB_BASED_DISCOUNT, ULP_DISCOUNT_BIRTHDAY, ULP_DISCOUNT_SPOUSE_BIRTHDAY, BILL_LEVEL_DISCOUNT,
	SYSTEM_DISCOUNT_DV, SYSTEM_DISCOUNT_GHS_BONUS, COIN_OFFER_DISCOUNT, EMPLOYEE_DISCOUNT, TATA_EMPLOYEE_DISCOUNT,
	TSSS_DISCOUNT, ITEM_GROUP_LEVEL_DISCOUNT, BEST_DEAL_DISCOUNT, HIGH_VALUE_DISCOUNT, KARAT_EXCHANGE_OFFER_DISCOUNT,
	EMPOWERMENT_DISCOUNT, ULP_DISCOUNT_ANNIVERSARY, SYSTEM_DISCOUNT_GEP_PURITY, DIGI_GOLD_DISCOUNT,
	RIVAAH_ASHIRWAAD_DISCOUNT, RIVAAH_CARD_DISCOUNT,GRN_MULTIPLE_DISCOUNT, CO_BILL_LEVEL_DISCOUNT;

	
	public static  String getUlpDiscountType(String discountType) {
		String value = null;
		switch(discountType) {
		case "ULP_DISCOUNT_ANNIVERSARY": value = UlpDiscountType.ANNIVERSARY.name();
		break;
		case "ULP_DISCOUNT_BIRTHDAY": value = UlpDiscountType.BIRTHDAY.name();
		break;
		case "ULP_DISCOUNT_SPOUSE_BIRTHDAY": value = UlpDiscountType.SPOUSE_BIRTHDAY.name();
		break;
		default: break;
		}
		return value;
	}
	
}
