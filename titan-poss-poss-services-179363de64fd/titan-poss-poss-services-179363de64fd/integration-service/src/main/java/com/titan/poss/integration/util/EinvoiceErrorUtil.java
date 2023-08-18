/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.util;

import java.util.HashMap;
import java.util.Map;

import com.titan.poss.core.domain.constant.EinvoiceErrorEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public final class EinvoiceErrorUtil {

	private static final Map<String, String> einvoiceErrorConstants = new HashMap<>();

	public static Map<String, String> getEinvoiceErrorConstants() {
		return einvoiceErrorConstants;
	}

	private EinvoiceErrorUtil() {
	}

	static {
		loadEinvoiceErrorConstantsDetails();
	}

	private static void loadEinvoiceErrorConstantsDetails() {
		einvoiceErrorConstants.put(EinvoiceErrorEnum.DUPLICATE.name(), "1");
		einvoiceErrorConstants.put(EinvoiceErrorEnum.DATA_ENTRY_MISTAKE.name(), "2");
		einvoiceErrorConstants.put(EinvoiceErrorEnum.ORDER_CANCELLED.name(), "3");
		einvoiceErrorConstants.put(EinvoiceErrorEnum.OTHERS.name(), "4");

	}

}
