/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.constant;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum DatasyncStatusEnum {

	SAVED("Message Yet to Publish to Destination Queue"), IN_QUEUE("Message is in Destination Queue"),
	RECEIVED("Message is received by Destination"), SYNCED("Message is processed and synced in Destination"),
	DISCARDED("Messaage is discarded by Destination"),
	FAILED_DEPENDENCY("Message failed to sync in Destination due to unavailability of dependent data"),
	FAILED_CONFLICT("Undefined"), FAILED_PERSIST("Message failed to persist in destination"),
	IN_PROGRESS("Message Yet to publis to datasync service"), NOTIFIED(("Notification sent to Source"));

	private String statusDesc;

	DatasyncStatusEnum(String statusDesc) {
		this.statusDesc = statusDesc;
	}

	public String getStatusDesc() {
		return statusDesc;
	}

}
