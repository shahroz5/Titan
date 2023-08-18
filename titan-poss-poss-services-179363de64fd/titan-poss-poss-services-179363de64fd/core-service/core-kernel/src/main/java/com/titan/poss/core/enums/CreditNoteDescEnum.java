package com.titan.poss.core.enums;

import java.util.HashMap;
import java.util.Map;

public enum CreditNoteDescEnum {
	
	ADV("ADVANCE"), BILL_CANCELLATION("BILL CANCELLATION"), CN_IBT("CN IBT"), GEP("GEP"), GHS("GHS"), GRN("GRN"), 
	TEP("TEP"), EVOUCHER("EVOUCHER"), DIGI_GOLD_TANISHQ("DIGI GOLD TANISHQ"), 
	DIGI_GOLD_NON_TANISHQ("DIGI GOLD NONTANISHQ"), TCS_CREDIT_NOTE("TCS");

	String value;

	public String getValue() {
		return this.value;
	}

	CreditNoteDescEnum(String value) {
		this.value = value;
	}

	static final Map<String, CreditNoteDescEnum> CREDIT_NOTE_DESC_ENUM = new HashMap<>();

	static {
		for (CreditNoteDescEnum d : values()) {
			CREDIT_NOTE_DESC_ENUM.put(d.getValue().toUpperCase(), d);
		}
	}
	
	public static boolean contains(String key) {
		return CREDIT_NOTE_DESC_ENUM.containsKey(key);
	}

	public static String valueOfEnum(String key) {
		for (CreditNoteDescEnum creditNoteType : CreditNoteDescEnum.values()) {
			if (creditNoteType.name().equals(key)) {
				return creditNoteType.getValue().toUpperCase();
			}
		}
		return "";
	}
	
}