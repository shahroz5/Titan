/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.File;
import java.util.Map;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * This class is a list format in Notification DTO to have multiple mail sending
 * in one shot option
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTypeDataDto {

	@NotNull
	private NotificationType notificationType;

	private Map<String, String> data;

	private Map<String, byte[]> attachments;

	private Map<String, File> fileAttachments;
}
