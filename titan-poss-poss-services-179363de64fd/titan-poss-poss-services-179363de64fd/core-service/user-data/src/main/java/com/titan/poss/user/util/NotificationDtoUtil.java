/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.user.dto.SendNotificationDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class NotificationDtoUtil {

	private NotificationDtoUtil() {
		throw new IllegalArgumentException("NotificationDtoUtil class");
	}

	// get mobileno inside list. As, for activation mobile no to registered mobile,
	// but for new mobile no verification, OTP to new mobile no, & both these flows
	// can come in one transaction
	// PENDING
	public static NotificationDto convertToIntegrationDto(List<SendNotificationDto> sendNotificationList) {

		SendNotificationDto firstSendNotf = sendNotificationList.get(0);
		String emailId = firstSendNotf.getEmail();
		String mobileNo = firstSendNotf.getMobileNo();

		NotificationDto notificationDto = new NotificationDto();
		notificationDto.setMobileNo(mobileNo);
		notificationDto.setEmailIds(new HashSet<>(Arrays.asList(emailId)));

		List<NotificationTypeDataDto> notificationTypeData = sendNotificationList.stream().filter(Objects::nonNull)
				.map(snl -> new NotificationTypeDataDto(snl.getNotificationType(), snl.getData(), null,null))
				.collect(Collectors.toList());
		notificationDto.setNotificationTypeData(notificationTypeData);

		return notificationDto;
	}

}
