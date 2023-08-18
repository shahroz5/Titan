/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.service;

import com.titan.poss.core.dto.NotificationDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface IntegrationService {

	/**
	 * Send notification (EMAIL OR SMS) using integration-service
	 * 
	 * @param notification
	 */
	void sendNotification(NotificationDto notification);

}
