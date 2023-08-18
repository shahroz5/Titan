/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import org.springframework.stereotype.Service;

import com.titan.poss.datasync.dto.MessageTransfer;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface ListnerService {

	void readMessageFromGeneralQueue(MessageTransfer messageTransfer);

	void readMessageFromPriorityQueue(MessageTransfer messageTransfer);

}
