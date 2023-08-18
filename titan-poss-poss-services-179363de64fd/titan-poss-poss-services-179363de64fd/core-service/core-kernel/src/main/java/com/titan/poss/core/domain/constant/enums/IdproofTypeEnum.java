package com.titan.poss.core.domain.constant.enums;

public enum IdproofTypeEnum {

	DRIVING_LICENSE("Driving License"), ELECTRICITY_BILL("Electricity Bill"), OTHER("Other"),PASSPORT("Passport"),RATION_CARD("Ration Card"),TELEPHONE_BILL("Telephone Bill");

	private String value;

	public String getValue() {
		return this.value;

	}

	private IdproofTypeEnum(String value) {
		this.value = value;
	}
	
}
