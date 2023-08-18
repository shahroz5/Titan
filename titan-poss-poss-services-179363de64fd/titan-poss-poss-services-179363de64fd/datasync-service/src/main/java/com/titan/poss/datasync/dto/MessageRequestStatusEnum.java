/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum MessageRequestStatusEnum {
	SAVED, IN_QUEUE, RECEIVED, SYNCED, DISCARDED, FAILED_DEPENDENCY, FAILED_CONFLICT, FAILED_PERSIST
}
