/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.constants;

/**
 * Discount status for each discount type.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum DiscountInitialStatusEnum {

	// @formatter:off
	CATEGORY_DISCOUNT(DiscountSalesStatusEnum.CONFIRMED.name()), 
	SLAB_BASED_DISCOUNT(DiscountSalesStatusEnum.CONFIRMED.name()), 
	ULP_DISCOUNT_BIRTHDAY(DiscountSalesStatusEnum.OPEN.name()), 
	ULP_DISCOUNT_SPOUSE_BIRTHDAY(DiscountSalesStatusEnum.OPEN.name()), 
	BILL_LEVEL_DISCOUNT(DiscountSalesStatusEnum.CONFIRMED.name()),
	CO_BILL_LEVEL_DISCOUNT(DiscountSalesStatusEnum.CONFIRMED.name()),
	SYSTEM_DISCOUNT_DV(DiscountSalesStatusEnum.OPEN.name()), 
	SYSTEM_DISCOUNT_GHS_BONUS(DiscountSalesStatusEnum.OPEN.name()), 
	COIN_OFFER_DISCOUNT(DiscountSalesStatusEnum.OPEN.name()), 
	EMPLOYEE_DISCOUNT((DiscountSalesStatusEnum.OPEN.name())), 
	TATA_EMPLOYEE_DISCOUNT(DiscountSalesStatusEnum.OPEN.name()),
	TSSS_DISCOUNT(DiscountSalesStatusEnum.OPEN.name()), 
	ITEM_GROUP_LEVEL_DISCOUNT(DiscountSalesStatusEnum.CONFIRMED.name()), 
	BEST_DEAL_DISCOUNT(DiscountSalesStatusEnum.CONFIRMED.name()), 
	HIGH_VALUE_DISCOUNT(DiscountSalesStatusEnum.CONFIRMED.name()), 
	KARAT_EXCHANGE_OFFER_DISCOUNT(DiscountSalesStatusEnum.OPEN.name()),
	EMPOWERMENT_DISCOUNT(DiscountSalesStatusEnum.OPEN.name()), 
	ULP_DISCOUNT_ANNIVERSARY(DiscountSalesStatusEnum.OPEN.name()), 
	SYSTEM_DISCOUNT_GEP_PURITY(DiscountSalesStatusEnum.OPEN.name()), 
	DIGI_GOLD_DISCOUNT(DiscountSalesStatusEnum.OPEN.name()),
	RIVAAH_ASHIRWAAD_DISCOUNT(DiscountSalesStatusEnum.OPEN.name()), 
	RIVAAH_CARD_DISCOUNT(DiscountSalesStatusEnum.OPEN.name()),
	GRN_MULTIPLE_DISCOUNT(DiscountSalesStatusEnum.OPEN.name());
	// @formatter:on

	String initialStatus;

	DiscountInitialStatusEnum(String initialStatus) {
		this.initialStatus = initialStatus;
	}

	public String getDiscountInitialStatus() {
		return this.initialStatus;
	}

}
