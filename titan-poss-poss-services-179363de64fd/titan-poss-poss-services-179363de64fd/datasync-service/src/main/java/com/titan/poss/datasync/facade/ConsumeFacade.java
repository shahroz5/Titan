/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.facade;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dao.DatasyncAuditDao;
import com.titan.poss.datasync.dto.DataflowDirectionEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.NotificationRequestDto;
import com.titan.poss.datasync.repository.DatasyncAuditRepository;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.NotificationService;
import com.titan.poss.datasync.service.SyncFactory;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.OperationCodesEnum;
import com.titan.poss.datasync.util.ReceiverUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ConsumeFacade {

	@Autowired
	NotificationService notificationService;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	private DatasyncAuditRepository datasyncAuditRepository;

	@Autowired
	SyncFactory syncFactory;

	@Value("${aws.sqs.profile}")
	private String appLocation;

	private static final Logger LOGGER = LoggerFactory.getLogger(ConsumeFacade.class);
	private static final String EXCEPTION = "exception : ";

//	@Async
	public void consumeMessage(MessageTransfer messageTransfer) {
		messageTransfer.getMessageTransferData().setDestination((messageTransfer.getMessageTransferData().getDestination()!=null)?messageTransfer.getMessageTransferData().getDestination():appLocation);
		DatasyncAuditDao destDa = datasyncAuditRepository
				.findByIdAndDestination(messageTransfer.getMessageTransferData().getId(),messageTransfer.getMessageTransferData().getDestination());
		if (destDa == null) {
			/* Save message in DB */
			String id = persistMessage(messageTransfer);

			/* Send notification to sender */
			NotificationRequestDto notificationRequest = new NotificationRequestDto();
			notificationRequest.setMessageId(id);
			notificationRequest.setStatus(DatasyncStatusEnum.RECEIVED.name());
			notificationRequest.setDestination(messageTransfer.getMessageTransferData().getDestination());
			notificationRequest.setSource(messageTransfer.getMessageTransferData().getSource());
			notificationRequest.setOperation(messageTransfer.getMessageTransferData().getOperation());
			try {
				notificationService.notifyToSender(notificationRequest);
			} catch (Exception e) {
				LOGGER.error(EXCEPTION, e);
			}

			consumeMessageTransfer(messageTransfer, id);
		}
	}

	public void consumeMessageTransfer(MessageTransfer messageTransfer, String id) {
		OperationCodesEnum operation = ReceiverUtil
				.getOperationCode(messageTransfer.getMessageTransferData().getOperation());
		SyncOperation so = syncFactory.getSyncOperation(operation);
		so.operation(messageTransfer);
		DatasyncAuditDao auditDao = datasyncAuditRepository.findByIdAndDestination(id, messageTransfer.getMessageTransferData().getDestination());
		NotificationRequestDto sendNotication = new NotificationRequestDto();
		sendNotication.setSource(messageTransfer.getMessageTransferData().getSource());
		sendNotication.setDestination(messageTransfer.getMessageTransferData().getDestination());
		sendNotication.setOperation(messageTransfer.getMessageTransferData().getOperation());
		sendNotication.setStatus(auditDao.getStatus());
		sendNotication.setMessageId(id);
		try {
			notificationService.notifyToSender(sendNotication);
		} catch (Exception e) {
			LOGGER.error(EXCEPTION, e);
		}
	}

	public String persistMessage(MessageTransfer messageTransfer) {
		DatasyncAuditDao da = new DatasyncAuditDao();
		MapperUtil.beanMapping(messageTransfer.getMessageTransferData(), da);
		da.setDestination(messageTransfer.getMessageTransferData().getDestination());
		da.setData(MapperUtil.getJsonString(messageTransfer.getMessageTransferData().getSyncData()));
		da.setStatus(DatasyncStatusEnum.RECEIVED.name());
		da.setMessageType(messageTransfer.getMessageType());
		da.setDataflowDirection(DataflowDirectionEnum.IN.name());
		return datasyncAuditService.addDatasyncAudit(da);
	}

}
