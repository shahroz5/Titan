/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationIntgDto;
import com.titan.poss.integration.service.NotificationService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for corporate user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("IntegrationNotificationController")
@RequestMapping(value = "integration/v2/notification")
public class NotificationController {

	@Autowired
	NotificationService notificationService;

	// @formatter:off
	@ApiOperation(value = "Send notification", notes = "This API will send email or SMS notification to email, mobile no provided<br>"
			+ "It can send email, SMS based on configuration set by particular notification type<br><br>"
			+ "'attachments' field will be in key-value pair which will hold file name & file content (byte array) respectively")
	// @formatter:on
	@PostMapping(value = "")
	public void sendNotification(
			@ApiParam(name = "body", value = "Notification details required to send", required = true) @RequestBody @Valid NotificationDto notificationDto) {
		notificationService.sendNotification(notificationDto);
	}

	@GetMapping(value = "/{notificationType}")
	public NotificationIntgDto getNotificationDtoByType(
			@ApiParam(name = "notificationType", required = true) @PathVariable("notificationType") @ValueOfEnum(enumClass = NotificationType.class) String notificationType) {

		return notificationService.getNotificationDtoByType(notificationType);
	}

}
