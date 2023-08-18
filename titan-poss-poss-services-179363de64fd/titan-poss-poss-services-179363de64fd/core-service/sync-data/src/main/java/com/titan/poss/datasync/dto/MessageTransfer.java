/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.dto;

import com.titan.poss.core.dto.MessageTransferData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MessageTransfer {

	private MessageTransferData messageTransferData;
	private String messageType;

}
