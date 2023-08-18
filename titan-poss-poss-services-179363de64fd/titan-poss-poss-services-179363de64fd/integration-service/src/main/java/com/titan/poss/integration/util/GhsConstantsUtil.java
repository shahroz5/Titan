/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.util;

import java.util.HashMap;
import java.util.Map;

import com.titan.poss.core.enums.GhsAccountDetailsStatusEnum;
import com.titan.poss.core.enums.GhsConstantsEnum;
import com.titan.poss.core.enums.GhsDiscountVoucherStatusEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public final class GhsConstantsUtil {

	private static final Map<String, Integer> ghsConstants = new HashMap<>();
	private static final Map<Integer, String> ghsAccountDetailsStatus = new HashMap<>();
	private static final Map<Integer, String> ghsDVStatusDetails = new HashMap<>();

	public static Map<String, Integer> getGhsconstants() {
		return ghsConstants;
	}

	public static Map<Integer, String> getGhsStatusDetails() {
		return ghsAccountDetailsStatus;
	}

	public static Map<Integer, String> getGhsDVStatusDetails() {
		return ghsDVStatusDetails;
	}

	private GhsConstantsUtil() {
	}

	static {
		loadGhsConstantsDetails();
		loadGhsStatusDetails();
		loadGhsDVStatusDetails();
	}

	private static void loadGhsConstantsDetails() {
		ghsConstants.put(GhsConstantsEnum.NEW_INSTANCE.name(), 0);
		ghsConstants.put(GhsConstantsEnum.HOLD.name(), 1);
		ghsConstants.put(GhsConstantsEnum.OPEN.name(), 2);
		ghsConstants.put(GhsConstantsEnum.CANCELLED.name(), 3);
		ghsConstants.put(GhsConstantsEnum.CLOSED.name(), 4);
		ghsConstants.put(GhsConstantsEnum.PARTIALLY_CLOSED.name(), 5);
		ghsConstants.put(GhsConstantsEnum.RECEIVED.name(), 6);
		ghsConstants.put(GhsConstantsEnum.CANCELLED_WITH_CN.name(), 7);
		ghsConstants.put(GhsConstantsEnum.CANCELLED_WITH_REFUND.name(), 8);
		ghsConstants.put(GhsConstantsEnum.SERVICE_PROCESSED.name(), 9);
		ghsConstants.put(GhsConstantsEnum.SERVICE_COMPLETED.name(), 10);
		ghsConstants.put(GhsConstantsEnum.PROCEED_TO_SKIP.name(), 11);
		ghsConstants.put(GhsConstantsEnum.SUSPENDED.name(), 12);
		ghsConstants.put(GhsConstantsEnum.FORCE_CLOSURE.name(), 13);
		ghsConstants.put(GhsConstantsEnum.BTQ_CLOSURE.name(), 14);
		ghsConstants.put(GhsConstantsEnum.RESIDUAL_CLOSURE.name(), 15);
		ghsConstants.put(GhsConstantsEnum.PARTIAL_ORDER.name(), 16);
		ghsConstants.put(GhsConstantsEnum.ITEM_CHANGED_AT_CM.name(), 17);
		ghsConstants.put(GhsConstantsEnum.TRANSFER.name(), 18);

	}

	private static void loadGhsStatusDetails() {

		ghsAccountDetailsStatus.put(0, GhsAccountDetailsStatusEnum.OPEN.name());
		ghsAccountDetailsStatus.put(1, GhsAccountDetailsStatusEnum.CLOSED.name());
		ghsAccountDetailsStatus.put(2, GhsAccountDetailsStatusEnum.MATURED.name());
		ghsAccountDetailsStatus.put(3, GhsAccountDetailsStatusEnum.PRE_MATURED.name());
		ghsAccountDetailsStatus.put(4, GhsAccountDetailsStatusEnum.SUSPENDED.name());
		ghsAccountDetailsStatus.put(5, GhsAccountDetailsStatusEnum.HOLD.name());

	}

	private static void loadGhsDVStatusDetails() {

		ghsDVStatusDetails.put(0, GhsDiscountVoucherStatusEnum.OPEN.name());
		ghsDVStatusDetails.put(1, GhsDiscountVoucherStatusEnum.REDEEMED.name());

	}
}
