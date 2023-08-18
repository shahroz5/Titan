/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.constants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum JobFileNameEnum {

	// @formatter:off

	ITEM_MASTER_FILE_NAME("itemMasterFileName"), STONE_MASTER_FILE_NAME("stoneMasterFileName"), MATERIAL_MASTER_FILE_NAME("materialMasterFileName"),
	PRICE_MASTER_FILE_NAME("priceMasterFileName"), ITEM_STONE_MAPPING_FILE_NAME("itemStoneMappingFileName"),
	ITEM_MATERIAL_MAPPING_FILE_NAME("itemMaterialMappingFileName"), GIFT_MASTER_INDENT_FILE_NAME("giftIndentFileName"), 
	GIFT_MASTER_STATUS_FILE_NAME("giftStatusFileName"), STN_FILE_NAME("stnFileName"), INVOICE_FILE_NAME("invoiceFileName"),
	STUDDED_SPLIT_FILE_NAME("studdedSplitFileName");

	// @formatter:on

	private String value;

	public String getValue() {
		return this.value;

	}

	private JobFileNameEnum(String value) {
		this.value = value;
	}
}
