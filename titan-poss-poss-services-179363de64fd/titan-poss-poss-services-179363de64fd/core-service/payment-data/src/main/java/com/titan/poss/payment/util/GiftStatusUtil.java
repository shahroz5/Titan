/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.util;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.enums.GiftVoucherStatusEnum;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public final class GiftStatusUtil {

	private static final Map<Integer, GiftVoucherStatusEnum> statusDetails = new HashMap<>();
	private static final Map<GiftVoucherStatusEnum, List<GiftVoucherStatusEnum>> giftUpdateStatus = new EnumMap<>(
			GiftVoucherStatusEnum.class);

	public static Map<Integer, GiftVoucherStatusEnum> getStatusdetails() {
		return statusDetails;
	}

	public static Map<GiftVoucherStatusEnum, List<GiftVoucherStatusEnum>> getGiftupdatestatus() {
		return giftUpdateStatus;
	}

	private GiftStatusUtil() {
	}

	static {
		loadStatusDetails();
		loadGiftStatusUpdate();
	}

	/**
	 * It will load the status Details
	 */
	private static void loadStatusDetails() {
		statusDetails.put(0, GiftVoucherStatusEnum.FOR_INWARDING);
		statusDetails.put(1, GiftVoucherStatusEnum.INACTIVE);
		statusDetails.put(2, GiftVoucherStatusEnum.REDEEMABLE);
		statusDetails.put(3, GiftVoucherStatusEnum.BLOCKED);
		statusDetails.put(4, GiftVoucherStatusEnum.REDEEMED);
		statusDetails.put(5, GiftVoucherStatusEnum.EXPIRED);
		statusDetails.put(6, GiftVoucherStatusEnum.AUTO_CANCELLATION);
		statusDetails.put(7, GiftVoucherStatusEnum.CANCELLED);
		statusDetails.put(9, GiftVoucherStatusEnum.ISSUEDTORO);
		statusDetails.put(13, GiftVoucherStatusEnum.FORCECLOSED);
	}

	/**
	 * It will load the status update details
	 */
	public static void loadGiftStatusUpdate() {

		List<GiftVoucherStatusEnum> giftStatusList = new ArrayList<>();

		List<GiftVoucherStatusEnum> giftStatusCommonList = new ArrayList<>();
		giftStatusCommonList.add(GiftVoucherStatusEnum.CANCELLED);
		giftStatusCommonList.add(GiftVoucherStatusEnum.FORCECLOSED);

		giftStatusList.add(GiftVoucherStatusEnum.CANCELLED);
		giftUpdateStatus.put(GiftVoucherStatusEnum.FOR_INWARDING, giftStatusList);

		giftStatusList = new ArrayList<>();
		giftStatusList.add(GiftVoucherStatusEnum.BLOCKED);
		giftStatusList.add(GiftVoucherStatusEnum.EXPIRED);
		giftStatusList.addAll(giftStatusCommonList);
		giftUpdateStatus.put(GiftVoucherStatusEnum.REDEEMABLE, giftStatusList);

		giftStatusList = new ArrayList<>();
		giftStatusList.add(GiftVoucherStatusEnum.REDEEMABLE);
		giftStatusList.add(GiftVoucherStatusEnum.EXPIRED);
		giftStatusList.addAll(giftStatusCommonList);
		giftUpdateStatus.put(GiftVoucherStatusEnum.BLOCKED, giftStatusList);

		giftStatusList = new ArrayList<>();
		giftStatusList.add(GiftVoucherStatusEnum.REDEEMABLE);
		giftStatusList.add(GiftVoucherStatusEnum.BLOCKED);
		giftStatusList.addAll(giftStatusCommonList);
		giftUpdateStatus.put(GiftVoucherStatusEnum.EXPIRED, giftStatusList);

	}

}