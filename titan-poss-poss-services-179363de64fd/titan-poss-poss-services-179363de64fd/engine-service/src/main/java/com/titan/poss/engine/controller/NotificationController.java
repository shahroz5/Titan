/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.titan.poss.core.dto.NotificationRequestDto;
import com.titan.poss.engine.service.NotificationService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("NotificationController")
@RequestMapping(value = "engine/v2/notifications")
public class NotificationController {

	@Autowired
	NotificationService notificationService;

	@ApiOperation(value = "API to get emitter", notes = "This API will return emitter for the user.")
	@GetMapping(value = "/register-user", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter registerEmitters() {
		return notificationService.registerEmitters();
	}

	@ApiOperation(value = "API to get Heartbeat event", notes = "This API sends Heartbeat event to all the emitters.")
	@GetMapping(value = "/heartbeat")
	@Scheduled(fixedRate = 44 * 1000)
//	@Scheduled(cron = "${poss.cron.heartbeat.frequency}")
	public void sendHeartbeat() {
		notificationService.sendHeartBeat();
	}

	@ApiOperation(value = "API to publish events", notes = "This API will publish events to users by interservice call")
	@PostMapping(value = "/publish-event")
	public void publishEvent(
			@ApiParam(name = "body", value = "Notification event object containing information to send the user as Notification", required = true) @RequestBody NotificationRequestDto notificationRequestDto) {
		notificationService.publishNotificationEvent(notificationRequestDto);
	}

}
