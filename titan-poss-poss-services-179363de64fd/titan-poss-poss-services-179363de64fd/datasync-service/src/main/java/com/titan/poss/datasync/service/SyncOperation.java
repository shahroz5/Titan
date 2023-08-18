/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import com.titan.poss.datasync.dto.MessageTransfer;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface SyncOperation {
	
	void operation(MessageTransfer messageTransfer);
}
