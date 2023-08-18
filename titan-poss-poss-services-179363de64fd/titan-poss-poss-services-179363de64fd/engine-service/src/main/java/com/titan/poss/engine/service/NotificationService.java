/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.engine.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.titan.poss.core.dto.NotificationRequestDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface NotificationService {

	SseEmitter registerEmitters();

	void sendHeartBeat();

	void publishNotificationEvent(NotificationRequestDto notificationRequestDto);

}
