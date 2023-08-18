/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * Payment status Enum.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum PaymentStatusEnum {
	OPEN, IN_PROGRESS, COMPLETED, FAILED, CANCELLED, DELETED, REVERSED, REVERSED_WITH_CN;

	public static List<String> getStatusNotAllowedForDelete() {
		List<String> strList = new ArrayList<>();
		strList.add(PaymentStatusEnum.CANCELLED.name());
		strList.add(PaymentStatusEnum.DELETED.name());
		strList.add(PaymentStatusEnum.REVERSED.name());
		strList.add(PaymentStatusEnum.REVERSED_WITH_CN.name());
		return strList;
	}

	public static List<String> getStatusNotAllowedForConfirmOrUpdate() {
		List<String> strList = new ArrayList<>();
		strList.add(PaymentStatusEnum.IN_PROGRESS.name());
		strList.add(PaymentStatusEnum.COMPLETED.name());
		strList.add(PaymentStatusEnum.FAILED.name());
		strList.add(PaymentStatusEnum.CANCELLED.name());
		strList.add(PaymentStatusEnum.DELETED.name());
		strList.add(PaymentStatusEnum.REVERSED.name());
		strList.add(PaymentStatusEnum.REVERSED_WITH_CN.name());
		return strList;
	}

	public static List<String> getPaidPaymentStatus() {
		return List.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.IN_PROGRESS.name(),
				PaymentStatusEnum.COMPLETED.name(), PaymentStatusEnum.FAILED.name());
	}

	public static List<String> getDeletedPaymentStatus() {
		return List.of(PaymentStatusEnum.DELETED.name(), PaymentStatusEnum.CANCELLED.name(),
				PaymentStatusEnum.REVERSED.name(),PaymentStatusEnum.REVERSED_WITH_CN.name());
	}

}
