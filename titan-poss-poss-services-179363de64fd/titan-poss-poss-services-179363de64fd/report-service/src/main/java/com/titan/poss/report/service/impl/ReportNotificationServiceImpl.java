package com.titan.poss.report.service.impl;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.report.service.ReportNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service("reportNotificationService")
public class ReportNotificationServiceImpl implements ReportNotificationService {

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Override
	public void sendReportNotification(String reportId, String reportName, AuthUser securityPrincipal) {

		if (securityPrincipal.getEmailId() == null) {
			throw new ServiceException("Some required field(s) for Email are missing", "ERR-INT-021");
		}
		String userName = securityPrincipal.getUsername();
		Set<String> emailIds = new HashSet<>();
		emailIds.add(securityPrincipal.getEmailId());

		Map<String, String> data = new HashMap<>();
		data.put("name", userName);
		data.put("date", CalendarUtils.getCurrentDate().toString());
		data.put("time", CalendarUtils.getCurrentHourAndMinute());
		data.put("reportId", reportId);
		data.put("reportName", reportName);
		data.put("orgName", securityPrincipal.getOrgCode());
		data.put("copyright", "");

		NotificationTypeDataDto notificationTypeDataDto = new NotificationTypeDataDto();
		notificationTypeDataDto.setNotificationType(NotificationType.REPORT_GENERATED);
		notificationTypeDataDto.setData(data);

		NotificationDto notificationDto = new NotificationDto();
		notificationDto.setEmailIds(emailIds);
		notificationDto.setLocationCode("urb");

		List<NotificationTypeDataDto> notificationTypeList = new ArrayList<>();
		notificationTypeList.add(notificationTypeDataDto);
		notificationDto.setNotificationTypeData(notificationTypeList);

		integrationServiceClient.sendNotification(notificationDto);

	}

}
