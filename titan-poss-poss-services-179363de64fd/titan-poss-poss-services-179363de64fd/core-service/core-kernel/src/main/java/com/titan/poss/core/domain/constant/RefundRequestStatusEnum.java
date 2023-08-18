/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum RefundRequestStatusEnum {

	APPROVAL_PENDING, PENDING_FROM_RO, REFUNDED, REJECTED, ALLOWED_TO_CANCEL, CANCELLED;

	public static List<String> getAllStatuses() {
		List<String> statusList = new ArrayList<>();
		statusList.add(RefundRequestStatusEnum.APPROVAL_PENDING.toString());
		statusList.add(RefundRequestStatusEnum.PENDING_FROM_RO.toString());
		statusList.add(RefundRequestStatusEnum.REFUNDED.toString());
		statusList.add(RefundRequestStatusEnum.REJECTED.toString());
		statusList.add(RefundRequestStatusEnum.ALLOWED_TO_CANCEL.toString());
		statusList.add(RefundRequestStatusEnum.CANCELLED.toString());
		return statusList;
	}

	public static List<String> getNextStatus(String refundStatus) {
		List<String> statusList = new ArrayList<>();
		if (RefundRequestStatusEnum.APPROVAL_PENDING.toString().equals(refundStatus)) {
			statusList.add(RefundRequestStatusEnum.PENDING_FROM_RO.toString());
		} else if (RefundRequestStatusEnum.PENDING_FROM_RO.toString().equals(refundStatus)) {
			statusList.add(RefundRequestStatusEnum.REFUNDED.toString());
			statusList.add(RefundRequestStatusEnum.REJECTED.toString());
		} else if (RefundRequestStatusEnum.REFUNDED.toString().equals(refundStatus)) {
			statusList.add(RefundRequestStatusEnum.ALLOWED_TO_CANCEL.toString());
		} else if (RefundRequestStatusEnum.REJECTED.toString().equals(refundStatus)) {
			// do nothing
		}
		return statusList;
	}
}
