/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.util;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class QueueNameConstant {

	private QueueNameConstant() {
		throw new IllegalStateException("LocationQueueType class");

	}

	public static final String GENERAL_QUEUE = "-GEN-QUEUE";
	public static final String PRIORITY_QUEUE = "-PRIORITY-QUEUE";
	public static final String NOTIFICATION_QUEUE = "-NOTIFICATION-QUEUE";
	public static final String FIFO_QUEUE = "-FIFO-QUEUE.fifo";

}
