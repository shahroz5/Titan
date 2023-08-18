/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service;

import java.util.Date;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.amazonaws.services.sqs.AmazonSQSAsync;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dao.DatasyncAuditDao;
import com.titan.poss.datasync.dto.DataflowDirectionEnum;
import com.titan.poss.datasync.dto.NotificationRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class NotificationServiceImpl implements NotificationService {

	@Autowired
	SQSService sqsService;

	@Value("${notification.data.queue}")
	private String notificationQueue;

	@Value("${aws.sqs.profile}")
	private String appLocation;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	PublisherService publisherService;
	
	private static final String NOTIFY="NOTIFY-";

	@Override
	@Async
	public void notifyToSender(NotificationRequestDto notificationRequestDto)
			throws InterruptedException, ExecutionException {
		String id = persistMessage(notificationRequestDto);
		notificationRequestDto.setNotificationId(id);
		publisherService.publishToNotificationQueue(notificationRequestDto, id);

	}

	public String persistMessage(NotificationRequestDto notificationRequest) {
		String id = UUID.randomUUID().toString();
		DatasyncAuditDao da = new DatasyncAuditDao();
		MapperUtil.beanMapping(notificationRequest, da);
		notificationRequest.setNotificationId(id);
		da.setId(id);
		da.setSource(notificationRequest.getDestination());
		da.setDestination(notificationRequest.getSource());
		da.setData(MapperUtil.getJsonString(notificationRequest));
		da.setStatus(DatasyncStatusEnum.SAVED.name());
		da.setDataflowDirection(DataflowDirectionEnum.OUT.name());
		da.setMessageType(MessageType.NOTIFICATION.toString());
		da.setSource(appLocation);
		da.setOperation(NOTIFY+notificationRequest.getOperation());
		return datasyncAuditService.addDatasyncAudit(da);
	}

	@Override
	@Async
	public void updateNotificationStatus(NotificationRequestDto notificationRequestDto) {
		persistMessageInReceiver(notificationRequestDto);
		datasyncAuditService.updateDatasyncAuditStatus(notificationRequestDto);

	}
	
	public String persistMessageInReceiver(NotificationRequestDto notificationRequest) {
		DatasyncAuditDao da = new DatasyncAuditDao();
		MapperUtil.beanMapping(notificationRequest, da);
		da.setId(notificationRequest.getNotificationId());
		da.setSource(notificationRequest.getDestination());
		da.setDestination(notificationRequest.getSource());
		da.setData(MapperUtil.getJsonString(notificationRequest));
		da.setStatus(DatasyncStatusEnum.RECEIVED.name());
		da.setDataflowDirection(DataflowDirectionEnum.IN.name());
		da.setMessageType(MessageType.NOTIFICATION.toString());
		da.setOperation(NOTIFY+notificationRequest.getOperation());
		da.setSyncTime(new Date().getTime());
		return datasyncAuditService.addDatasyncAudit(da);
	}

}
