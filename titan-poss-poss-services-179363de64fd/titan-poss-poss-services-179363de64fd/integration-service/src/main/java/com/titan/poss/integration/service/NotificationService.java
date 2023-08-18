/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service;

import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationIntgDto;
import com.titan.poss.integration.intg.dao.Notification;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface NotificationService {

	/**
	 * It will send notification on mail, SMS which are configured
	 * 
	 * @param notificationDto
	 */
	public void sendNotification(NotificationDto notificationDto);

	/**
	 * Get Notification specific details for provided NotificationType
	 * 
	 * @param notificationType
	 * @return Notification
	 */
	public Notification getNotificationByType(NotificationType notificationType);

	/**
	 * 
	 * @param notificationTypeStr
	 * @return
	 */
	NotificationIntgDto getNotificationDtoByType(String notificationType);

}
