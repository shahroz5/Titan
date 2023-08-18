/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.dto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class NotificationRequestDto {

	private String notificationId;
	private String messageId;
	private String destination;
	private String source;
	private String status;
	private String operation;

}
