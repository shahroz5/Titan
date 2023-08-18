/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.constant;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum ProductGroupCodeEnum {
	GOLD_PLAIN("71", "Gold Plain"), PJWS("75", "Plain Jewellery with Stones"),
	STUDDED_COLOR_STONES("78", "Studded - Color Stones"), HIGH_VALUE_STUDDED("86", "High Value Studded"),
	OPEN_POLKI_STONES("88", "OPEN POLKI STONES"), GLASS_KUNDAN("95", "Glass Kundan"), MIA_PLAIN("90", "Mia Plain"),
	MIA_STUDDED("91", "Mia Studded"), MIA_COLOUR("A3", "Mia Colour"), MIA_STUDDED_UCP("B1", "Mia Studded UCP"),
	MIA_PLAIN_UCP("B2", "Mia Plain UCP"), MIA_COLOUR_STONE_UCP("B3", "MIA-Colour Stone-UCP"),
	GOLD_COIN("73", "Gold Coin"), SILVER_COIN("82", "Silver Coin"), GOLD_STUDDED("72", "Gold Studded");

	private String code;
	private String value;

	public String getCode() {
		return this.code;
	}

	public String getValue() {
		return this.value;
	}

	private ProductGroupCodeEnum(String code, String value) {
		this.code = code;
		this.value = value;
	}

	public static List<String> getConversionList() {
		List<String> conversionProductList = new ArrayList<>();
		conversionProductList.add(GOLD_PLAIN.getCode());
		conversionProductList.add(PJWS.getCode());
		conversionProductList.add(STUDDED_COLOR_STONES.getCode());
		conversionProductList.add(HIGH_VALUE_STUDDED.getCode());
		conversionProductList.add(OPEN_POLKI_STONES.getCode());
		conversionProductList.add(GLASS_KUNDAN.getCode());
		return conversionProductList;

	}

	public static List<String> getStuddedList() {
		List<String> studdedProductList = new ArrayList<>();
		studdedProductList.add(STUDDED_COLOR_STONES.getCode());
		studdedProductList.add(HIGH_VALUE_STUDDED.getCode());
		studdedProductList.add(OPEN_POLKI_STONES.getCode());
		studdedProductList.add(GLASS_KUNDAN.getCode());
		studdedProductList.add(GOLD_STUDDED.getCode());
		return studdedProductList;

	}

	public static List<String> getPlainList() {
		List<String> plainProductList = new ArrayList<>();
		plainProductList.add(GOLD_PLAIN.getCode());
		plainProductList.add(PJWS.getCode());
		return plainProductList;

	}

	public static List<String> getCoinList() {
		List<String> coinList = new ArrayList<>();
		coinList.add(GOLD_COIN.getCode());
		coinList.add(SILVER_COIN.getCode());
		return coinList;

	}

	public static List<String> getNonUCP() {
		List<String> nonUcpProductList = new ArrayList<>();
		nonUcpProductList.add(MIA_PLAIN.getCode());
		nonUcpProductList.add(MIA_COLOUR.getCode());
		nonUcpProductList.add(MIA_STUDDED.getCode());
		return nonUcpProductList;

	}

	public static List<String> getUCP() {
		List<String> ucpProductList = new ArrayList<>();
		ucpProductList.add(MIA_STUDDED_UCP.getCode());
		ucpProductList.add(MIA_PLAIN_UCP.getCode());
		ucpProductList.add(MIA_COLOUR_STONE_UCP.getCode());
		return ucpProductList;

	}

}
