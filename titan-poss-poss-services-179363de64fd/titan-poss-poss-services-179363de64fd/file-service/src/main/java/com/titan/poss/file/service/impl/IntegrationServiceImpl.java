/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.file.dao.FileAuditDao;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.service.IntegrationService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class IntegrationServiceImpl implements IntegrationService {

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private Environment env;

	@Override
	public void sendMailForFailedJob(FileAuditDao fileAudit, String userEmailId) {
		try {
			NotificationDto notificationDtoForEmail = getNotificationDtoForEmail(fileAudit, userEmailId);
//			if (CollectionUtil.isEmpty(notificationDtoForEmail.getEmailIds()))
//				notificationDtoForEmail.setEmailIds(Set.of("default@mindtree.com"));
			if (!CollectionUtil.isEmpty(notificationDtoForEmail.getEmailIds()))
				integrationServiceClient.sendNotification(notificationDtoForEmail);
		} catch (Exception e) {
			log.info("Mail sending failed " + e.getMessage());
		}
	}

	private NotificationDto getNotificationDtoForEmail(FileAuditDao fileAudit, String userEmailId) {
		Set<String> emailIds = getEmailIds(fileAudit.getFileMaster());
		if (!StringUtils.isEmpty(userEmailId)) {
			emailIds.add(userEmailId);
		}
		Map<String, String> data = new HashMap<>();
		data.put("jobName", fileAudit.getFileMaster().getFileName());
		data.put("date", fileAudit.getStartTime().toString());
		data.put("fileName", fileAudit.getFileName());
		data.put("processedDate", fileAudit.getProcessedDate().toString());
		data.put("status", fileAudit.getStatus());
		if (fileAudit.getTotalCount() != null) {
			data.put("totalCount", fileAudit.getTotalCount().toString());
			data.put("successCount", fileAudit.getSuccessCount().toString());
			data.put("failureCount", fileAudit.getFailureCount().toString());
		}
		data.put("remarks", fileAudit.getRemarks());
		data.put("copyright", "");

		NotificationTypeDataDto notificationTypeDataDto = new NotificationTypeDataDto();
		notificationTypeDataDto.setNotificationType(NotificationType.FAILED_JOB);
		notificationTypeDataDto.setData(data);
		File errorLogFile = getErrorLogFile(fileAudit);
		if (errorLogFile != null) {
			notificationTypeDataDto
					.setAttachments(Map.of("error_log.csv", FileUtil.convertFileToByteArray(errorLogFile)));
		}
		NotificationDto notificationDto = new NotificationDto();
		notificationDto.setEmailIds(emailIds);

		List<NotificationTypeDataDto> notificationTypeList = new ArrayList<>();
		notificationTypeList.add(notificationTypeDataDto);
		notificationDto.setNotificationTypeData(notificationTypeList);

		return notificationDto;
	}

	private Set<String> getEmailIds(FileMasterDao fileMaster) {
		String emailIds = fileMaster.getEmailIds();
		if (StringUtils.isEmpty(emailIds)) {
			return new HashSet<>();
		}
		String[] splitEmailIds = emailIds.split(",");
		return new HashSet<>(Arrays.asList(splitEmailIds));
	}

	private File getErrorLogFile(FileAuditDao fileAudit) {
		File file = new File(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ FileIntegrationConstants.PATH_DELIMITTER + env.getProperty("errorLog.file.folder")
				+ FileIntegrationConstants.PATH_DELIMITTER + fileAudit.getFileMaster().getFileGroup()
				+ FileIntegrationConstants.PATH_DELIMITTER + fileAudit.getFileId() + ".csv");
		if (file.exists()) {
			return file;
		}
		return null;
	}

}
