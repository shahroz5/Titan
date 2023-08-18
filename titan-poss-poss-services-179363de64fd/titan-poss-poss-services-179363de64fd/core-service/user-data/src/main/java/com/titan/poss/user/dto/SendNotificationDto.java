/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.dto;

import java.util.Map;

import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.domain.constant.SMSTypeEnum;

import lombok.Data;

/**
 * DTO class for sending mail
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class SendNotificationDto {

	Map<String, String> data;

	String templateName;

	String email;
	String mobileNo;

	SMSTypeEnum smsType;

	String userName;

	NotificationType notificationType;
}
