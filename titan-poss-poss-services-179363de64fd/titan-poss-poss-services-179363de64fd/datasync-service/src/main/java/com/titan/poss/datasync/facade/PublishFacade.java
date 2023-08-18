/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.facade;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dao.DatasyncAuditDao;
import com.titan.poss.datasync.dao.LocationQueueDao;
import com.titan.poss.datasync.dto.DataflowDirectionEnum;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.PublisherServiceImpl;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PublishFacade {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	PublisherServiceImpl publisherServiceImpl;

	@Value("${aws.sqs.profile}")
	private String appLocation;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(PublishFacade.class);

	public String publishMessage(MessageRequest messageRequest) throws InterruptedException, ExecutionException {

		/* Persist Message in DB */
		String id = persistMessage(messageRequest);
        /* Async Publish to SNS */
        if (messageRequest.getDestinationType().equals(DestinationType.ALL.toString())) {
            LOGGER.info("Calling publishToSNS Method");
            publisherServiceImpl.publishToSNS(messageRequest, id);
        }
        if (messageRequest.getDestinationType().equals(DestinationType.SELECTIVE.toString())) {
            LOGGER.info("Calling publishToQueue Method");
            publisherServiceImpl.publishToQueue(messageRequest, id);
        }
		return id;
	}


	private String persistMessage(MessageRequest messageRequest) {
		List<DatasyncAuditDao> daList = new ArrayList<>();
		String id = UUID.randomUUID().toString();
		
		// For Destination type ALL
		if (messageRequest.getDestinationType().equals(DestinationType.ALL.name())) {
			List<LocationQueueDao> dests = datasyncAuditService.getAllActiveLocation();
			List<String> locations = new ArrayList<>();
			for (LocationQueueDao loc : dests) {
				locations.add(loc.getLocationCode());
			}
			messageRequest.setDestinations(locations);
		}

		for (String dest : messageRequest.getDestinations()) {

			DatasyncAuditDao da = new DatasyncAuditDao();
			MapperUtil.beanMapping(messageRequest.getMessageRequestData(), da);
			da.setId(id);
			da.setDestination(dest);
			da.setData(MapperUtil.getJsonString(messageRequest.getMessageRequestData().getSyncData()));
			da.setStatus(DatasyncStatusEnum.SAVED.name());
			da.setDataflowDirection(DataflowDirectionEnum.OUT.name());
			da.setMessageType(messageRequest.getMessageType());
			if(messageRequest.getSource()!=null) {
				da.setSource(messageRequest.getSource());
			}else {
				da.setSource(appLocation);
			}
			daList.add(da);
		}
		datasyncAuditService.addDatasyncAuditList(daList);
		return id;
	}
}
