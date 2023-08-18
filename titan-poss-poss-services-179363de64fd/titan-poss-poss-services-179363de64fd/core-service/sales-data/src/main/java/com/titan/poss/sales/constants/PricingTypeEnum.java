package com.titan.poss.sales.constants;

public enum PricingTypeEnum {

	// @formatter:off

	PLAIN("PLAIN"), STUDDED("STUDDED"), OTHER("OTHER"), PJWS("PJWS"), PLAIN_STUDDED("PLAIN_STUDDED");

	// @formatter:on

	private String value;

	public String getValue() {
		return this.value;

	}

	private PricingTypeEnum(String value) {
		this.value = value;
	}
}

